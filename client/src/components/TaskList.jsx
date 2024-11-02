import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import TaskFilter from './TaskFilter';
import { motion, AnimatePresence } from 'framer-motion';

const TaskList = () => {
    const { tasks = [], loading } = useTaskContext();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <TaskFilter />

            <AnimatePresence>
                {!tasks?.length ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12 bg-white rounded-2xl shadow-lg border border-purple-100"
                    >
                        <p className="text-gray-500">No tasks found. Create a new task to get started!</p>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        className="grid gap-4"
                    >
                        {tasks.map(task => (
                            <TaskItem key={task._id} task={task} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TaskList;