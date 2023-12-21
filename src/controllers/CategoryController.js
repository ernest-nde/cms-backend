const { Category } = require('../db/sequelize');
exports.getAllCategories = async (req, res, next) => {
    try {
        await Category.findAll()
        .then((categories) => {
            if(!categories) {
                return res.status(500).json({
                    message: 'Error getting categories'
                });
            } else if(categories.length === 0) {
                return res.status(404).json({
                    message: 'No categories found'
                });
            } else {
                res.status(200).json({
                    message: 'Categories retrieved successfully',
                    data: categories
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: 'Error getting categories',
                error: error
            });
        })
    } catch (error) {
        next(error);
    }
}

exports.getCategory = async (req, res, next) => {
    try {
        await Category.findByPk(req.params.id)
       .then((category) => {
            if(!category) {
                return res.status(404).json({
                    message: 'Category not found'
                });
            } else {
                res.status(200).json({
                    message: `Category ${category.label} retrieved successfully`,
                    data: category
                });
            }
        })
       .catch((error) => {
            res.status(500).json({
                message: 'Error getting category',
                error: error
            });
        })
    } catch (error) {
        next(error);
    }   
}

exports.createCategory = async (req, res, next) => {
    const { label, description } = req.body;
    const { userId } = req.auth;

    try {
        if(!label) {
            return res.status(404).json({
                message: 'Category label is required'
            })
        }

        if(!description) {
            return res.status(404).json({
                message: 'Category description is required'
            })
        }

        await Category.create({
            userId,
            label,
            description
        })
        .then((category) => {
            if(!category) {
                return res.status(500).json({
                    message: 'Error creating category'
                });
            } else {
                res.status(201).json({
                    message: 'Category created successfully',
                    data: category
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: 'Error creating category',
                error: error
            });
        })
    } catch (error) {
        next(error);
    }
}

exports.updateCategory = async (req, res, next) => {
    const { label, description } = req.body;
    const { id } = req.params;
    const { roleId } = req.auth;

    try {
        if(!label) {
            return res.status(404).json({
                message: 'Category label is required'
            })
        }

        if(!description) {
            return res.status(404).json({
                message: 'Category description is required'
            })
        }

        await Category.findByPk(id)
        .then((category) => {
            if(!category) {
                return res.status(404).json({
                    message: 'Category not found'
                });
            } else {
                if(roleId !== 1) {
                    if(category.userId !== req.auth.userId) {
                        return res.status(403).json({
                            message: 'You are not allowed to update this category'
                        });
                    } else {
                        category.update({
                            label,
                            description
                        }, 
                        {
                            where: { id }
                        })
                    .then((updatedCategory) => {
                            if(!updatedCategory) {
                                return res.status(500).json({
                                    message: 'Error updating category'
                                });
                            } else {
                                res.status(200).json({
                                    message: 'Category updated successfully',
                                    data: updatedCategory
                                });
                            }
                        })
                    .catch((error) => {
                            res.status(500).json({
                                message: 'Error updating category',
                                error: error
                            });
                        });
                    }
                } else {
                    category.update({
                        label,
                        description
                    }, 
                    {
                        where: { id }
                    })
                .then((updatedCategory) => {
                        if(!updatedCategory) {
                            return res.status(500).json({
                                message: 'Error updating category'
                            });
                        } else {
                            res.status(200).json({
                                message: 'Category updated successfully',
                                data: updatedCategory
                            });
                        }
                    })
                .catch((error) => {
                        res.status(500).json({
                            message: 'Error updating category',
                            error: error
                        });
                    });
                }
            }
        })
        .catch((error) => {
            return res.status(500).json({
                message: 'Error updating category'
            });
        })
    } catch (error) {
        next(error);
    }
}

exports.deleteCategory = async (req, res, next) => {
    const { id } = req.params;
    const {userId } = req.auth;

    try {
        await Category.findByPk(id)
      .then((category) => {
        if(!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        } else {
            if(req.auth.roleId !== 1) {
                if(category.userId !== userId) {
                    return res.status(403).json({
                        message: 'You are not allowed to delete this category'
                    });
                } else {
                    category.destroy({
                        where: { id }
                    })
                    .then((deletedCategory) => {
                        if(!deletedCategory) {
                            return res.status(500).json({
                                message: 'Error deleting category'
                            });
                        } else {
                            res.status(200).json({
                                message: 'Category deleted successfully',
                                data: deletedCategory
                            });
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({
                            message: 'Error deleting category',
                            error: error
                        });
                    });
                }
            } else {
                category.destroy({
                    where: { id }
                })
                .then((deletedCategory) => {
                    if(!deletedCategory) {
                        return res.status(500).json({
                            message: 'Error deleting category'
                        });
                    } else {
                        res.status(200).json({
                            message: 'Category deleted successfully',
                            data: deletedCategory
                        });
                    }
                })
                .catch((error) => {
                    res.status(500).json({
                        message: 'Error deleting category',
                        error: error
                    });
                });
            }
        }
      })
    } catch (error) {
        next(error);
    }
}