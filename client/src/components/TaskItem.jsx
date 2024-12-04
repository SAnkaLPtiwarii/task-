import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  FlagIcon,
  ClockIcon,
  XMarkIcon,
  ArrowPathIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const TaskItem = ({ task }) => {
  const { deleteTask, updateTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [isHovered, setIsHovered] = useState(false);

  // Configuration for priority styles and labels
  const priorityConfig = {
    low: {
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      icon: '🌱',
      label: 'Low Priority'
    },
    medium: {
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      icon: '⚡',
      label: 'Medium Priority'
    },
    high: {
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      icon: '🔥',
      label: 'High Priority'
    }
  };

  // Configuration for status styles
  const statusConfig = {
    pending: {
      color: 'bg-yellow-100 text-yellow-800',
      progressColor: 'bg-yellow-500',
      width: '0%'
    },
    in_progress: {
      color: 'bg-blue-100 text-blue-800',
      progressColor: 'bg-blue-500',
      width: '50%'
    },
    completed: {
      color: 'bg-green-100 text-green-800',
      progressColor: 'bg-green-500',
      width: '100%'
    }
  };

  // Handle status cycling (pending -> in_progress -> completed)
  const handleStatusChange = async () => {
    try {
      const statusOrder = ['pending', 'in_progress', 'completed'];
      const currentIndex = statusOrder.indexOf(task.status);
      const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
      await updateTask(task._id, { ...task, status: nextStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save changes
  const handleSave = async () => {
    try {
      await updateTask(task._id, editedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // Handle delete task
  const handleDelete = async () => {
    try {
      if (window.confirm('Are you sure you want to delete this task?')) {
        await deleteTask(task._id);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Calculate days remaining until due date
  const calculateDaysLeft = () => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft();

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`
                    rounded-2xl bg-white shadow-lg border-l-4
                    ${task.status === 'completed' ? 'border-green-500' :
            task.priority === 'high' ? 'border-rose-500' :
              'border-purple-500'}
                    hover:shadow-xl transition-shadow duration-300
                `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isEditing ? (
          // Edit Mode
          <div className="p-6 space-y-4">
            {/* Title Input */}
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              className="w-full text-lg font-medium rounded-xl border-purple-100 focus:border-purple-300 focus:ring focus:ring-purple-200"
            />

            {/* Description Input */}
            <textarea
              name="description"
              value={editedTask.description}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-xl border-purple-100 focus:border-purple-300 focus:ring focus:ring-purple-200"
            />

            {/* Status and Priority Selects */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editedTask.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border-purple-100 focus:border-purple-300 focus:ring focus:ring-purple-200"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={editedTask.priority}
                  onChange={handleChange}
                  className="w-full rounded-xl border-purple-100 focus:border-purple-300 focus:ring focus:ring-purple-200"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Due Date Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={format(new Date(editedTask.dueDate), 'yyyy-MM-dd')}
                onChange={handleChange}
                className="w-full rounded-xl border-purple-100 focus:border-purple-300 focus:ring focus:ring-purple-200"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
              >
                Save Changes
              </motion.button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="relative overflow-hidden">
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: statusConfig[task.status].width }}
                className={`h-full ${statusConfig[task.status].progressColor}`}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="p-6">
              {/* Title and Action Buttons */}
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                  {task.title}
                </h3>
                <motion.div
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  className="flex items-center space-x-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-400 hover:text-purple-600 rounded-full hover:bg-purple-50"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDelete}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4">{task.description}</p>

              {/* Task Metadata */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Status Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStatusChange}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[task.status].color} flex items-center gap-2`}
                >
                  {task.status === 'completed' ? (
                    <CheckCircleIcon className="h-4 w-4" />
                  ) : (
                    <ArrowPathIcon className="h-4 w-4" />
                  )}
                  {task.status.replace('_', ' ')}
                </motion.button>

                {/* Priority Badge */}
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${priorityConfig[task.priority].color}`}>
                  <span>{priorityConfig[task.priority].icon}</span>
                  {priorityConfig[task.priority].label}
                </span>

                {/* Due Date Badge */}
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 
                                    ${daysLeft <= 0 ? 'bg-red-100 text-red-800' :
                    daysLeft <= 3 ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'}`}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {daysLeft <= 0 ? 'Overdue' :
                    daysLeft === 1 ? 'Due tomorrow' :
                      daysLeft <= 3 ? `Due in ${daysLeft} days` :
                        format(new Date(task.dueDate), 'MMM d')}
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskItem;