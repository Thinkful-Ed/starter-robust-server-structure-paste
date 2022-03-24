const router = require('express').Router();
const methodNotAllowed = require('../errors/methodNotAllowed');
const controller = require('./users.controller');
const pastesRouter = require('../pastes/pastes.router');

router.use("/:userId/pastes", controller.userExists, pastesRouter);

router.route('/:userId')
	.get(controller.read)
	.all(methodNotAllowed);
	
router.route('/')
	.get(controller.list)
	.all(methodNotAllowed);
	
module.exports = router;