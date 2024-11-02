import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { motion } from 'framer-motion';

const TaskProgress = () => {
    const { tasks } = useTaskContext();

    const calculateProgress = () => {
        if (tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.status === 'completed').length;
        return Math.round((completed / tasks.length) * 100);
    };

    const progress = calculateProgress();

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Overall Progress</h3>
                <span className="text-2xl font-bold text-purple-600">{progress}%</span>
            </div>

            <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-purple-500 rounded-full"
                />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                <div className="text-gray-600">
                    <div className="font-medium">Total Tasks</div>
                    <div className="text-lg font-bold text-gray-900">{tasks.length}</div>
                </div>
                <div className="text-gray-600">
                    <div className="font-medium">In Progress</div>
                    <div className="text-lg font-bold text-blue-600">
                        {tasks.filter(t => t.status === 'in_progress').length}
                    </div>
                </div>
                <div className="text-gray-600">
                    <div className="font-medium">Completed</div>
                    <div className="text-lg font-bold text-green-600">
                        {tasks.filter(t => t.status === 'completed').length}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskProgress;