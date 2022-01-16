const router = require('express').Router();
const { getUsers, getUser, createUser } = require('../controllers/users');

// /users
router.get('/', getUsers);

router.get('/:id', getUser);

router.post('/', createUser);

module.exports = router;
