const { Comment, User, Post } = require('../db/sequelize');

exports.getAllComments = async (req, res, next) => {
    const roleId  = parseInt(req.auth.roleId);
    const authUserId = parseInt(req.auth.userId);
    const commentUserId = parseInt(req.query.userId);

    try {
        if(roleId === 1) {
            await Comment.findAll({
                include: [
                    {
                        model: User,
                        as: 'user'
                    },
                    {
                        model: Post,
                        as: 'post'
                    },
                    {   
                        model: Comment,
                        as: 'first_comment'
                    }
                ]
            })
            .then((comments) => {

                if(!comments) {
                    res.status(404).json({ message: 'Error when fetching comments' });
                }

                if(comments.length === 0) {
                    res.status(404).json({ message: 'No comments found' });
                }

                res.status(200).json({
                    message: `${comments.length} comments retrieved successfully`,
                    data: comments
                });
            })
            .catch((error) => {
                res.status(404).json({ 
                    message: 'Error when fetching comments',
                    error: error
                });
            });
        } else {
            if(authUserId === commentUserId) {
                await Comment.findAll({
                    where: {
                        userId: commentUserId
                    },
                    include: [
                        {
                            model: User,
                            as: 'user'
                        },
                        {
                            model: Post,
                            as: 'post'
                        },
                        {   
                            model: Comment,
                            as: 'first_comment'
                        }
                    ]
                })
                .then((comments) => {
                
                    if(!comments) {
                        res.status(404).json({ message: 'Error when fetching comments' });
                    }

                        if(comments.length === 0) {
                        res.status(404).json({ message: 'No comments found' });
                    }

                        res.status(200).json({
                        message: `${comments.length} comments retrieved successfully`,
                        data: comments
                    });
                })
                .catch((error) => {
                    res.status(404).json({ 
                        message: 'Error when fetching comments',
                        error: error
                    });
                });
            } else {
                res.status(403).json({ message: 'You are not allowed to perform this action' });
            }

            
            
        }
    } catch (error) {
        next(error);
    }
}

exports.getComment = async (req, res, next) => {
    const { id } = req.params;

    try {
        await Comment.findOne({
            where: {
                id
            },
            include: [
                {
                    model: User,
                    as: 'user'
                },
                {
                    model: Post,
                    as: 'post'
                },
                {   
                    model: Comment,
                    as: 'first_comment'
                }
            ]
        })
        .then((comment) => {
            if(!comment) {
                res.status(404).json({ message: 'Comment not found!' });
            }
            res.status(200).json({
                message: 'Comment retrieved successfully',
                data: comment
            });
        })
        .catch((error) => {
            res.status(404).json({ 
                message: 'Error when fetching comment',
                error: error
            });
        })
    } catch (error) {
        next(error);
    }
}

exports.createComment = async (req, res, next) => {
    const { postId, content } = req.body;
    const { userId } = req.auth;
    
    
    try {
        await Comment.create({
            userId,
            postId,
            content
        })
       .then((comment) => {
            if(!comment) {
                res.status(404).json({ message: 'Error when creating comment' });
            }

            res.status(201).json({
                message: 'Comment created successfully',
                data: comment
            });
       })
    } catch (error) {
        next(error);
    }
}

exports.updateComment = async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;
    const { roleId, userId } = req.auth;

    try {
        if(!content) {
            res.status(400).json({ message: 'Content is required' });
        }

        await Comment.findByPk(id)
        .then(async (comment) => {
            if(!comment) {
                res.status(404).json({ message: 'Comment not found!' });
            }
            
            if( roleId!== 1 ) {
                if( comment.userId !== userId ) {
                    res.status(403).json({ message: 'You are not allowed to perform this action'});
                } else {
                    await comment.update({ content })
                    .then((upadatedComment) => {
                        if(!upadatedComment) {
                            res.status(404).json({ message: 'Error when updating comment' });
                        }
                        
                        res.status(200).json({
                            message: 'Comment updated successfully',
                            data: upadatedComment
                        });
                    })
                    .catch((error) => {
                        res.status(404).json({ 
                            message: 'Error when updating comment',
                            error: error
                        });
                    });
                }
            } else {
                await comment.update({ content })
                .then((upadatedComment) => {
                    if(!upadatedComment) {
                        res.status(404).json({ message: 'Error when updating comment' });
                    }
                    
                    res.status(200).json({
                        message: 'Comment updated successfully',
                        data: upadatedComment
                    });
                })
                .catch((error) => {
                    res.status(404).json({ 
                        message: 'Error when updating comment',
                        error: error
                    });
                });
            }
        })
        .catch((error) => {
            res.status(404).json({ 
                message: 'Error when updating comment',
                error: error
            });
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteComment = async (req, res, next) => {
    const { id } = req.params;
    const { roleId, userId } = req.auth;

    try {
        await Comment.findByPk(id)
        .then(async comment => {
            if(!comment) {
                res.status(404).json({ message: 'Comment not found!' });
            }

            if( roleId !== 1 ) {
                if( comment.userId!== userId ) {
                    res.status(403).json({ message: 'You are not allowed to perform this action'});
                } else {
                    await comment.destroy()
                   .then(() => {
                        res.status(200).json({
                            message: 'Comment deleted successfully'
                        });
                    })
                    .catch((error) => {
                        res.status(404).json({ 
                            message: 'Error when deleting comment',
                            error: error
                        });
                    });
                }
            } else {
                await comment.destroy()
               .then(() => {
                    res.status(200).json({
                        message: 'Comment deleted successfully'
                    });
                })
                .catch((error) => {
                    res.status(404).json({ 
                        message: 'Error when deleting comment',
                        error: error
                    });
                });
            }
        })
        .catch( error => {
            res.status(404).json({ 
                message: 'Error when deleting comment',
                error: error
            });
        });
    } catch (error) {
        next(error);
    }
}