const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Wrap async controllers
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes with better error handling
router.get('/', asyncHandler(taskController.getAllTasks));
router.post('/', asyncHandler(taskController.createTask));
router.get('/:id', asyncHandler(taskController.getTaskById));
router.put('/:id', asyncHandler(taskController.updateTask));
router.delete('/:id', asyncHandler(taskController.deleteTask));

// Route not found handler
router.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Task route not found: ${req.method} ${req.url}`
    });
});

module.exports = router;
