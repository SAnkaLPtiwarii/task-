import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { motion, AnimatePresence } from 'framer-motion';

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
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
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

            {/* Tasks List */}
            <AnimatePresence mode="wait">
                <motion.div layout className="grid gap-4">
                    {tasks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-12 bg-white rounded-xl shadow-lg"
                        >
                            <p className="text-gray-500">
                                {filters.priority || filters.status
                                    ? 'No tasks match the selected filters'
                                    : 'No tasks found. Create a new task to get started!'}
                            </p>
                        </motion.div>
                    ) : (
                        tasks.map(task => (
                            <TaskItem key={task._id} task={task} />
                        ))
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Filter Reset */}
            {(filters.priority || filters.status || filters.sortBy) && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setFilters({ status: '', priority: '', sortBy: '' })}
                    className="text-sm text-purple-600 hover:text-purple-700 underline"
                >
                    Clear all filters
                </motion.button>
            )}
        </div>
    );
};

export default TaskList;