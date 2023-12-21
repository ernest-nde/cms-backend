const express = require('express');
const router = express.Router();
const { signup, login, getAllUsers, updateUser, getUser, deleteUser } = require('../controllers/UserController');
const auth = require('../middlewares/auth');

router.post('/signup', signup);
router.post('/login', login);

// OTHER ROUTES
router.get('/', auth, getAllUsers);
router.get('/:id', auth, getUser);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;