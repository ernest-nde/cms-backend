const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {getAllCategories, getCategory, createCategory, updateCategory, deleteCategory} = require('../controllers/CategoryController');

router.get('/', auth, getAllCategories);
router.get('/:id', auth, getCategory);
router.post('/', auth, createCategory);
router.put('/:id', auth, updateCategory);
router.delete('/:id', auth, deleteCategory);

module.exports = router;