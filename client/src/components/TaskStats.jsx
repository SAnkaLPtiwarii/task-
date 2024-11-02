import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { motion } from 'framer-motion';
import {
    ChartBarIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const TaskStats = () => {
    const { tasks = [], loading } = useTaskContext();

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-lg p-4 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                ))}
            </div>
        );
    }

    const stats = {
        total: tasks?.length || 0,
        completed: tasks?.filter(t => t?.status === 'completed')?.length || 0,
        inProgress: tasks?.filter(t => t?.status === 'in_progress')?.length || 0,
        pending: tasks?.filter(t => t?.status === 'pending')?.length || 0
    };

    const statCards = [
        {
            title: 'Total Tasks',
            value: stats.total,
            icon: ChartBarIcon,
            color: 'bg-purple-100 text-purple-600',
        },
        {
            title: 'Completed',
            value: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`,
            icon: CheckCircleIcon,
            color: 'bg-green-100 text-green-600',
        },
        {
            title: 'In Progress',
            value: stats.inProgress,
            icon: ClockIcon,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            title: 'Pending',
            value: stats.pending,
            icon: ExclamationCircleIcon,
            color: 'bg-amber-100 text-amber-600',
        }
    ];

    // In TaskContext.jsx, add this function:

    const sortTasks = (tasks, sortBy) => {
        if (!sortBy) return tasks;

        return [...tasks].sort((a, b) => {
            switch (sortBy) {
                case 'dueDate_asc':
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'dueDate_desc':
                    return new Date(b.dueDate) - new Date(a.dueDate);
                case 'priority_desc':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'priority_asc':
                    const priorityOrderAsc = { low: 1, medium: 2, high: 3 };
                    return priorityOrderAsc[a.priority] - priorityOrderAsc[b.priority];
                case 'status':
                    const statusOrder = { completed: 3, in_progress: 2, pending: 1 };
                    return statusOrder[b.status] - statusOrder[a.status];
                case 'created_desc':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });
    };

    // In the fetchTasks function:
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/tasks`);
            const sortedTasks = sortTasks(response.data || [], filters.sortBy);
            setTasks(sortedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to fetch tasks');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100"
                >
                    <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-xl ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <motion.span
                            className="text-2xl font-bold text-gray-900"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 100 }}
                        >
                            {stat.value}
                        </motion.span>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-600">{stat.title}</h3>
                </motion.div>
            ))}
        </div>
    );
};

export default TaskStats;