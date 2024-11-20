const Task = require('../models/Task');

const taskController = {
    // Get all tasks
    getAllTasks: async (req, res) => {
        try {
            const tasks = await Task.find().sort({ updatedAt: -1 });
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create task
    createTask: async (req, res) => {
        try {
            const task = new Task(req.body);
            const savedTask = await task.save();

            // Emit socket event
            const io = req.app.get('io');
            io.emit('taskCreated', savedTask);

            res.status(201).json(savedTask);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update task
    updateTask: async (req, res) => {
        try {
            const updatedTask = await Task.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!updatedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }

            // Emit socket event
            const io = req.app.get('io');
            io.emit('taskUpdated', updatedTask);

            res.json(updatedTask);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete task
    deleteTask: async (req, res) => {
        try {
            const task = await Task.findById(req.params.id);

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            await task.remove();

            // Emit socket event
            const io = req.app.get('io');
            io.emit('taskDeleted', req.params.id);

            res.json({ message: 'Task deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = taskController;