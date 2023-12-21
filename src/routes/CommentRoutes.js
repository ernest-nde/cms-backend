const express = require('express');
const { getAllComments, getComment, createComment, updateComment, deleteComment } = require('../controllers/CommentController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/', auth, getAllComments);
router.get('/:id', auth, getComment);
router.post('/', auth, createComment);
router.put('/:id', auth, updateComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;