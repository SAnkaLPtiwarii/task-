import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { motion } from 'framer-motion';
import {
    CalendarDaysIcon,
    FlagIcon,
    ClockIcon,
    ArrowsUpDownIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const TaskFilter = () => {
    const { filters, setFilters, tasks } = useTaskContext();

    const sortOptions = [
        {
            value: 'dueDate_asc',
            label: 'Due Date (Earliest)',
            icon: CalendarDaysIcon,
            description: 'Show tasks with closest due dates first'
        },
        {
            value: 'dueDate_desc',
            label: 'Due Date (Latest)',
            icon: CalendarDaysIcon,
            description: 'Show tasks with furthest due dates first'
        },
        {
            value: 'priority_desc',
            label: 'Priority (High to Low)',
            icon: FlagIcon,
            description: 'Show high priority tasks first'
        },
        {
            value: 'priority_asc',
            label: 'Priority (Low to High)',
            icon: FlagIcon,
            description: 'Show low priority tasks first'
        },
        {
            value: 'status',
            label: 'Status',
            icon: CheckCircleIcon,
            description: 'Group by completion status'
        },
        {
            value: 'created_desc',
            label: 'Recently Added',
            icon: ClockIcon,
            description: 'Show newest tasks first'
        }
    ];

    const handleSort = (sortValue) => {
        setFilters(prev => ({ ...prev, sortBy: sortValue }));

        // Sort tasks based on the selected option
        const sortedTasks = [...tasks].sort((a, b) => {
            switch (sortValue) {
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

        return sortedTasks;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Sort Tasks</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {sortOptions.map((option) => (
                            <motion.button
                                key={option.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSort(option.value)}
                                className={`
                  p-4 rounded-xl border transition-all duration-200
                  ${filters.sortBy === option.value
                                        ? 'bg-purple-50 border-purple-200 ring-2 ring-purple-500 ring-opacity-50'
                                        : 'bg-white border-gray-200 hover:bg-gray-50'}
                  flex flex-col gap-2
                `}
                            >
                                <div className="flex items-center gap-3">
                                    <option.icon className={`h-5 w-5 
                    ${filters.sortBy === option.value ? 'text-purple-600' : 'text-gray-500'}`}
                                    />
                                    <span className={`font-medium 
                    ${filters.sortBy === option.value ? 'text-purple-900' : 'text-gray-700'}`}
                                    >
                                        {option.label}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 text-left">
                                    {option.description}
                                </p>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-gray-500">
                        {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
                    </p>
                    {filters.sortBy && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilters(prev => ({ ...prev, sortBy: '' }))}
                            className="text-sm text-purple-600 hover:text-purple-700"
                        >
                            Clear sort
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskFilter;