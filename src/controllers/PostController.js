const { Post } = require('../db/sequelize');

exports.getAllPosts = async (req, res, next) => {
    try {
        await Post.findAll()
        .then((posts) => {
            if(!posts) {
                return res.status(500).json({
                    message: 'Error getting posts'
                });
            } else if(posts.length === 0) {
                return res.status(404).json({
                    message: 'No posts found'
                });
            } else {
                res.status(200).json({
                    message: 'posts retrieved successfully',
                    data: posts
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: 'Error getting posts',
                error: error
            });
        })
    } catch (error) {
        next(error);
    }
}

exports.getPost = async (req, res, next) => {
    const { id } = req.params;
    try {
        await Post.findByPk(id)
      .then((post) => {
            if(!post) {
                return res.status(404).json({
                    message: 'Post not found'
                });
            } else {
                res.status(200).json({
                    message: `Post ${post.title} retrieved successfully`,
                    data: post
                });
            }
        })
      .catch((error) => {
            res.status(500).json({
                message: 'Error getting post',
                error: error
            });
        })
    } catch (error) {
        next(error);
    }
}

exports.createPost = async (req, res, next) => {
    const { categoryId, title, body } = req.body;
    const { userId } = req.auth;

    try {
        if(!categoryId) {
            return res.status(404).json({
                message: 'Category ID is required'
            })
        }

        if(!title) {
            return res.status(404).json({
                message: 'Post title is required'
            })
        }

        if(!body) {
            return res.status(404).json({
                message: 'Post body is required'
            })
        }

        await Post.create({
            userId,
            categoryId,
            title,
            body
        })
      .then((post) => {
            if(!post) {
                return res.status(500).json({
                    message: 'Error creating post'
                });
            } else {
                res.status(201).json({
                    message: 'post created successfully',
                    data: post
                });
            }
        })
      .catch((error) => {
            res.status(500).json({
                message: 'Error creating post',
                error: error
            });
        })
    } catch (error) {
        next(error);
    }
}

exports.updatePost = async (req, res, next) => {
    const { categoryId, title, body } = req.body;
    const { id } = req.params;
    const { roleId } = req.auth;
    
    try {

        if(!categoryId) {
            return res.status(404).json({
                message: 'Category ID is required'
            })
        }

        if(!title) {
            return res.status(404).json({
                message: 'Post title is required'
            })
        }

        if(!body) {
            return res.status(404).json({
                message: 'Post body is required'
            })
        }
        
        await Post.findByPk(id)
        .then((post) => {
            if(!post) {
                return res.status(404).json({
                    message: 'Post not found'
                });
            } else {
                if(roleId !== 1) {
                    if(post.userId !== req.auth.userId) {
                        return res.status(403).json({
                            message: 'You are not allowed to update this post'
                        });
                    } else {
                        post.update({
                            categoryId,
                            title,
                            body
                        }, 
                        {
                            where: { id }
                        })
                    .then((updatedPost) => {
                            if(!updatedPost) {
                                return res.status(500).json({
                                    message: 'Error updating post'
                                });
                            } else {
                                res.status(200).json({
                                    message: 'Post updated successfully',
                                    data: updatedPost
                                });
                            }
                        })
                    .catch((error) => {
                            res.status(500).json({
                                message: 'Error updating post',
                                error: error
                            });
                        });
                    }
                } else {
                    post.update(
                        {
                            categoryId,
                            title,
                            body
                        }, 
                        { where: { id } }
                    )
                    .then((updatedPost) => {
                            if(!updatedPost) {
                                return res.status(500).json({
                                    message: 'Error updating post'
                                });
                            } else {
                                res.status(200).json({
                                    message: 'Post updated successfully',
                                    data: updatedPost
                                });
                            }
                        })
                    .catch((error) => {
                            res.status(500).json({
                                message: 'Error updating post',
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

exports.deletePost = async (req, res, next) => {
    const { id } = req.params;
    const { userId, roleId } = req.auth;

    try {
        await Post.findByPk(id)
        .then((post) => {
            if(!post) {
                return res.status(404).json({
                    message: 'Post not found'
                });
            } else {
                if(roleId !== 1) {
                    if(post.userId !== userId) {
                        return res.status(403).json({
                            message: 'You are not allowed to delete this post'
                        });
                    } else {
                        post.destroy({
                            where: { id }
                        })
                        .then((deletedPost) => {
                            if(!deletedPost) {
                                return res.status(500).json({
                                    message: 'Error deleting post'
                                });
                            } else {
                                res.status(200).json({
                                    message: 'post deleted successfully',
                                    data: deletedPost
                                });
                            }
                        })
                        .catch((error) => {
                            res.status(500).json({
                                message: 'Error deleting post',
                                error: error
                            });
                        });
                    }
                } else {
                    post.destroy({
                        where: { id }
                    })
                    .then((deletedPost) => {
                        if(!deletedPost) {
                            return res.status(500).json({
                                message: 'Error deleting post'
                            });
                        } else {
                            res.status(200).json({
                                message: 'Post deleted successfully',
                                data: deletedPost
                            });
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({
                            message: 'Error deleting post',
                            error: error
                        });
                    });
                }
            }
        })
        .catch((error) => {
            return res.status(404).json({
                message: 'Post not found'
            });
        });
    } catch (error) {
        next(error);
    }
}