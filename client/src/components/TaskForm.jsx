import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { PlusIcon, CalendarIcon, FlagIcon } from '@heroicons/react/24/outline';

const TaskForm = () => {
    const { createTask } = useTaskContext();
    const [isExpanded, setIsExpanded] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        assignedTo: 'user123',
        createdBy: 'user123'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createTask(formData);
        setFormData({
            ...formData,
            title: '',
            description: ''
        });
        setIsExpanded(false);
    };

    const priorityConfig = {
        low: {
            color: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100',
            activeColor: 'bg-emerald-100 ring-2 ring-emerald-500 text-emerald-700',
            icon: '🌱',
            label: 'Low'
        },
        medium: {
            color: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100',
            activeColor: 'bg-amber-100 ring-2 ring-amber-500 text-amber-700',
            icon: '⚡',
            label: 'Medium'
        },
        high: {
            color: 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100',
            activeColor: 'bg-rose-100 ring-2 ring-rose-500 text-rose-700',
            icon: '🔥',
            label: 'High'
        }
    };

    return (
        <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100"
        >
            <div className="p-8">
                <motion.form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex items-center gap-4">
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="h-12 w-12 flex items-center justify-center rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                        >
                            <PlusIcon className="h-6 w-6" />
                        </motion.button>
                        <input
                            type="text"
                            placeholder="What needs to be done?"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="flex-1 text-lg font-medium placeholder-gray-400 border border-purple-100 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 rounded-xl py-3 px-4"
                            onClick={() => setIsExpanded(true)}
                        />
                    </div>

                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <CalendarIcon className="h-5 w-5 mr-2 text-purple-500" />
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="w-full rounded-xl border-purple-100 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 py-3"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <FlagIcon className="h-5 w-5 mr-2 text-purple-500" />
                                        Priority
                                    </label>
                                    <div className="flex flex-col space-y-3">
                                        {Object.entries(priorityConfig).map(([key, config]) => (
                                            <motion.button
                                                key={key}
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setFormData({ ...formData, priority: key })}
                                                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
                          ${formData.priority === key ? config.activeColor : config.color}
                          flex items-center justify-start gap-3`}
                                            >
                                                <span className="text-xl">{config.icon}</span>
                                                <span className="font-medium">{config.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="4"
                                    className="w-full rounded-xl border-purple-100 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                                    placeholder="Add any additional details..."
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-2">
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsExpanded(false)}
                                    className="px-8 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-medium transition-colors"
                                >
                                    Create Task
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </motion.form>
            </div>
        </motion.div>
    );
};

export default TaskForm;
