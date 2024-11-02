const Task = require('../models/Task');

const taskController = {
    // Get all tasks
    getAllTasks: async (req, res) => {
        try {
            const { status, sortBy } = req.query;
            let query = {};

            // Filter by status if provided
            if (status) {
                query.status = status;
            }

            // Build sort object
            let sort = {};
            if (sortBy === 'dueDate') {
                sort.dueDate = 1;
            } else if (sortBy === 'priority') {
                sort.priority = -1;
            }

            const tasks = await Task.find(query).sort(sort);
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create new task
    createTask: async (req, res) => {
        try {
            const task = new Task(req.body);
            const savedTask = await task.save();

            // Emit socket event for real-time update
            const io = req.app.get('io');
            io.to(req.body.assignedTo).emit('taskCreated', savedTask);

            res.status(201).json(savedTask);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update task
    updateTask: async (req, res) => {
        try {
            const task = await Task.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            // Emit socket event for real-time update
            const io = req.app.get('io');
            io.to(task.assignedTo).emit('taskUpdated', task);

            res.json(task);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete task
    deleteTask: async (req, res) => {
        try {
            const task = await Task.findByIdAndDelete(req.params.id);

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            // Emit socket event for real-time update
            const io = req.app.get('io');
            io.to(task.assignedTo).emit('taskDeleted', req.params.id);

            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get task by ID
    getTaskById: async (req, res) => {
        try {
            const task = await Task.findById(req.params.id);

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            res.json(task);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = taskController;
