const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Middleware to catch async errors
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', asyncHandler(taskController.getAllTasks));
router.post('/', asyncHandler(taskController.createTask));
router.get('/:id', asyncHandler(taskController.getTaskById));
router.put('/:id', asyncHandler(taskController.updateTask));
router.delete('/:id', asyncHandler(taskController.deleteTask));

module.exports = router;
