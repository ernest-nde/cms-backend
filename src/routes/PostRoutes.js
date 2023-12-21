const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getAllPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/PostController');

router.get('/', auth, getAllPosts);
router.get('/:id', auth, getPost);
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

module.exports = router;