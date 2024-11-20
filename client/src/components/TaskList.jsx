import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { motion } from 'framer-motion';

const TaskList = () => {
    const { tasks, loading, filters, setFilters } = useTaskContext();

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
                {/* Status Filter */}
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="rounded-xl border-purple-100 focus:border-purple-300 focus:ring focus:ring-purple-200"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>

                {/* Priority Filter */}
                <select
                    name="priority"
                    value={filters.priority}
                    onChange={handleFilterChange}
                    className="rounded-xl border-purple-100 focus:border-purple-300 focus:ring focus:ring-purple-200"
                >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                {/* Sort Options */}
                <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="rounded-xl border-purple-100 focus:border-purple-300 focus:ring focus:ring-purple-200"
                >
                    <option value="">Sort By</option>
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                </select>
            </div>

            <motion.div
                layout
                className="grid gap-4"
            >
                {tasks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                        <p className="text-gray-500">No tasks found. Create a new task to get started!</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <TaskItem key={task._id} task={task} />
                    ))
                )}
            </motion.div>
        </div>
    );
};

export default TaskList;