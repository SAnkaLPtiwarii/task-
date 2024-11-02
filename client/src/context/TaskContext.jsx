import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSocket } from '../hooks/useSocket';

// Create context
const TaskContext = createContext(null);

// Custom hook for using context
export function useTaskContext() {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
}

export function TaskProvider({ children }) {
    // State
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        sortBy: '',
        searchQuery: ''
    });
    const [userName, setUserName] = useState(() => {
        return localStorage.getItem('taskManagerUserName') || '';
    });

    const socket = useSocket();

    // Sort function
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

    // Fetch tasks
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

    // Create task
    const createTask = async (taskData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/tasks', {
                ...taskData,
                createdBy: userName
            });

            setTasks(prev => {
                const newTasks = [...prev, response.data];
                return sortTasks(newTasks, filters.sortBy);
            });

            toast.success('Task created successfully');
            return response.data;
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error('Failed to create task');
            throw error;
        }
    };

    // Update task
    const updateTask = async (taskId, taskData) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, taskData);

            setTasks(prev => {
                const newTasks = prev.map(task =>
                    task._id === taskId ? response.data : task
                );
                return sortTasks(newTasks, filters.sortBy);
            });

            toast.success('Task updated successfully');
            return response.data;
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error('Failed to update task');
            throw error;
        }
    };

    // Delete task
    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
            setTasks(prev => prev.filter(task => task._id !== taskId));
            toast.success('Task deleted successfully');
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
            throw error;
        }
    };

    // Get task statistics
    const getTasksStats = () => {
        return {
            total: tasks.length,
            completed: tasks.filter(t => t.status === 'completed').length,
            inProgress: tasks.filter(t => t.status === 'in_progress').length,
            pending: tasks.filter(t => t.status === 'pending').length
        };
    };

    // Socket event handlers
    useEffect(() => {
        if (!socket) return;

        const handleTaskCreated = (newTask) => {
            setTasks(prev => {
                const newTasks = [...prev, newTask];
                return sortTasks(newTasks, filters.sortBy);
            });
        };

        const handleTaskUpdated = (updatedTask) => {
            setTasks(prev => {
                const newTasks = prev.map(task =>
                    task._id === updatedTask._id ? updatedTask : task
                );
                return sortTasks(newTasks, filters.sortBy);
            });
        };

        const handleTaskDeleted = (taskId) => {
            setTasks(prev => prev.filter(task => task._id !== taskId));
        };

        socket.on('taskCreated', handleTaskCreated);
        socket.on('taskUpdated', handleTaskUpdated);
        socket.on('taskDeleted', handleTaskDeleted);

        return () => {
            socket.off('taskCreated', handleTaskCreated);
            socket.off('taskUpdated', handleTaskUpdated);
            socket.off('taskDeleted', handleTaskDeleted);
        };
    }, [socket, filters.sortBy]);

    // Fetch tasks when filters change
    useEffect(() => {
        fetchTasks();
    }, [filters]);

    // The context value object
    const contextValue = {
        tasks,
        loading,
        filters,
        setFilters,
        userName,
        setUserName,
        createTask,
        updateTask,
        deleteTask,
        getTasksStats,
        fetchTasks
    };

    return (
        <TaskContext.Provider value={contextValue}>
            {children}
        </TaskContext.Provider>
    );
}

export default TaskContext;