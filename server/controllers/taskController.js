const Task = require('../models/Task');

const taskController = {
    // Get all tasks
    getAllTasks: async (req, res) => {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    },

    // Get single task
    getTaskById: async (req, res) => {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    },

    // Create task
    createTask: async (req, res) => {
        const task = new Task(req.body);
        const savedTask = await task.save();

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.emit('taskCreated', savedTask);
        }

        res.status(201).json(savedTask);
    },

    // Update task
    updateTask: async (req, res) => {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.emit('taskUpdated', task);
        }

        res.json(task);
    },

    // Delete task
    deleteTask: async (req, res) => {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.deleteOne({ _id: req.params.id });

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.emit('taskDeleted', req.params.id);
        }

        res.json({ message: 'Task deleted successfully', id: req.params.id });
    }
};

module.exports = taskController;