const { User, Role } = require('../db/sequelize');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User sign up
exports.signup = async (req, res, next) => {
    const { name, email, password, birthday } = req.body;
    try {
       await bcrypt.hash(password, 10, async (err, hash) => {
        if(err) {
            return next(err);
        } else {
            await User.findOne({ where: { email } })
            .then( async (existUser) => {
                if(existUser) {
                    return res.status(403).json({
                        message: `A user with this email already exists`
                    });
                } else {
                    if(!name) {
                        return res.status(403).json({
                            message: 'User name is required'
                        });
                    }

                    if(!email) {
                        return res.status(403).json({
                            message: 'User email is required'
                        });
                    }

                    if(!password) {
                        return res.status(403).json({
                            message: 'User password is required'
                        });
                    }

                    if(!birthday) {
                        return res.status(403).json({
                            message: 'User birthday date is required'
                        });
                    }

                    await User.create({
                        roleId: 2,
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,   
                        birthday: req.body.birthday                 
                    })
                    .then((user) => {
                        if(!user) {
                            return res.status(500).json({
                                message: 'Error creating user'
                            });
                        }

                        res.status(201).json({
                            message: 'User created successfully',
                            data: user
                        });
                    })
                    .catch((error) => {
                        res.status(500).json({
                            message: 'Error creating user',
                            error: error
                        });
                    });
                }
            });
        }
       });
    } catch (error) {
        next(error);
    }
};
// User login
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    
    if(!email) {
        return res.status(403).json({
            message: 'User email is required'
        });
    }

    if(!password) {
        return res.status(403).json({
            message: 'User password is required'
        });
    }
    
    await User.findOne({ 
        where: { email }, 
        include: [ { 
            model: Role,
            as: 'role'
        } ] 
    })
    .then(async (user) => {
        if(!user) {
            return res.status(403).json({
                message: 'User not found'
            });
        } else {
            
            await bcrypt.compare(password, user.password, async (err, result) => {
                if(err) {
                    return next(err);
                } 
                
                if(result === false) {
                    return res.status(403).json({
                        message: 'Invalid email or password'
                    });
                } else {
                    const payload = {
                        id: user.id,
                        roleId: user.roleId,
                        name: user.name,
                        email: user.email,
                        birthday: user.birthday
                    };

                    const token = jwt.sign(
                        payload, 
                        process.env.JWT_SECRET, 
                        { 
                            expiresIn: 86400, // expires in 24 hours 
                            algorithm: 'HS256'
                        }
                    );

                    await res.status(200).json({
                        message: 'User logged in successfully',
                        data: user,
                        token: `Bearer ${token}`
                    });
                }
            })
        }
    })
};

// OTHER FEATURES
// Get all register users
exports.getAllUsers = async (req, res, next) => {
    const { roleId } = req.auth;
    if(roleId === 1) {
        try {
            await User.findAll({
                include: [
                    {
                        model: Role,
                        as: 'role'
                    }
                ]
            })
            .then((users) => {
                if(!users) {
                    return res.status(500).json({
                        message: 'Error getting users'
                    });
                } else if(users.length === 0) {
                    return res.status(404).json({
                        message: 'No users found'
                    });
                } else {
                    res.status(200).json({
                        message: 'Users retrieved successfully',
                        data: users
                    });
                }
    
            })
            .catch((error) => {
                res.status(500).json({
                    message: 'Error getting users',
                    error: error
                });
            })
        } catch (error) {
            next(error);
        }
    } else {
        return res.status(403).json({
            message: `You are not allow to perform this action`
        });
    }
};

// Get single user
exports.getUser = async (req, res, next) => {
    const { id } = req.params;
    const { roleId, userId } = req.auth;

    try {
        await User.findByPk(id)
        .then((user) => {
            if(!user) {
                return res.status(403).json({
                    message: 'User not found'
                });
            } else {
                if(roleId !== 1) {
                    if(user.id !== userId) {
                        return res.status(403).json({
                            message: 'You are not allowed to perform this action'
                        });
                    } else {
                        res.status(200).json({
                            message: 'User retrieved successfully',
                            data: user
                        });
                    }
                } else {
                    res.status(200).json({
                        message: 'User retrieved successfully',
                        data: user
                    });
                }
            }
        })
    } catch (error) {
        next(error);
    }
}

// Update user profile
exports.updateUser = async (req, res, next) => {
    const { id } = req.params;
    const {userId, roleId} = req.auth;
    const { name, email, password, birthday } = req.body;

    try {
        await User.findByPk(id)
        .then(async (user) => {
            if(!user) {
                return res.status(403).json({
                    message: 'User not found'
                });
            } else {
                if(roleId !== 1) {
                    if(user.id !== userId) {
                        return res.status(403).json({
                            message: 'You are not allowed to update this user'
                        });
                    } else {
                        if(!name) {
                            return res.status(403).json({
                                message: 'User name is required'
                            });
                        }
                        
                        if(!email) {
                            return res.status(403).json({
                                message: 'User email is required'
                            });
                        }

                        if(!birthday) {
                            return res.status(403).json({
                                message: 'User birthday is required'
                            });
                        }

                        if(!password) {
                            return res.status(403).json({
                                message: 'User password is required'
                            })
                        }

                        bcrypt.hash(password, 10, async (err, hash) => {
                            if(err) {
                                return next(err);
                            }

                            await user.update(
                                {
                                    name,
                                    email,
                                    password: hash,
                                    birthday
                                },
                                { where: { id } }
                            )
                            .then((updatedUser) => {
                                if(!updatedUser) {
                                    return res.status(500).json({
                                        message: 'Error updating user'
                                    });
                                } else {
                                    res.status(200).json({
                                        message: 'User updated successfully',
                                        data: updatedUser
                                    });
                                }
                            })
                            .catch((error) => {
                                res.status(500).json({
                                    message: 'Error updating user',
                                    error: error
                                });
                            });
                        })
                    }
                } else {
                    user.update(
                        {
                            name,
                            email,
                            password,
                            birthday
                        },
                        { where: { id } }
                    )
                    .then((updatedUser) => {
                        if(!updatedUser) {
                            return res.status(500).json({
                                message: 'Error updating user'
                            });
                        } else {
                            res.status(200).json({
                                message: 'User updated successfully',
                                data: updatedUser
                            });
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({
                            message: 'Error updating user',
                            error: error
                        });
                    });
                }
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: 'Error updating user',
                error: error
            });
        })

    } catch(error) {
        next(error);
    }
}

// Delete user account
exports.deleteUser = async (req, res, next) => {
    const { id } = req.params;
    const {userId, roleId} = req.auth;

    try {
        await User.findByPk(id)
        .then(async (user) => {
            if(!user) {
                return res.status(403).json({
                    message: 'User not found'
                });
            } else {
                if(roleId !== 1) {
                    if(user.id !== userId) {
                        return res.status(403).json({
                            message: 'You are not allowed to delete this user'
                        });
                    } else {
                        await user.delete({ where: { id } })
                        .then((deletedUser) => {
                            if(!deletedUser) {
                                return res.status(500).json({
                                    message: 'Error deleting user'
                                });
                            } else {
                                res.status(200).json({
                                    message: 'User deleted successfully',
                                    data: deletedUser
                                });
                            }
                        })
                        .catch((error) => {
                            return res.status(500).json({
                                message: 'Error deleting user'
                            });
                        });
                    }
                } else {
                    await user.delete({ where: { id } })
                    .then((deletedUser) => {
                        if(!deletedUser) {
                            return res.status(500).json({
                                message: 'Error deleting user'
                            });
                        } else {
                            res.status(200).json({
                                message: 'User deleted successfully',
                                data: deletedUser
                            });
                        }
                    })
                    .catch((error) => {
                        return res.status(500).json({
                            message: 'Error deleting user'
                        });
                    });
                }
            }
        })
    } catch (error) {
        next(error);
    }
}
