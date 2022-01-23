const router = require('express').Router();
const {
  getUsers,
  getUser,
  // getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
} = require('../controllers/users');
const auth = require('../middleware/auth');

// /users
router.get('/', auth, getUsers);

router.get('/:id', auth, getUser);

// router.get('/me', auth, getCurrentUser);

router.post('/signin', login);

router.post('/signup', createUser);

router.patch('/me', auth, updateUser);

router.patch('/me/avatar', auth, updateAvatar);

module.exports = router;
