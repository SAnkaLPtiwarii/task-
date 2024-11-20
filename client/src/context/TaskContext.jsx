import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSocket } from '../hooks/useSocket';

const TaskContext = createContext(null);

export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        sortBy: '',
        priority: ''
    });

    const socket = useSocket();
    const API_URL = import.meta.env.VITE_API_URL;

    // Filter tasks based on current filters
    const getFilteredTasks = () => {
        return tasks.filter(task => {
            if (filters.status && task.status !== filters.status) return false;
            if (filters.priority && task.priority !== filters.priority) return false;
            return true;
        });
    };

    // Sort filtered tasks
    const getSortedTasks = (filteredTasks) => {
        if (!filters.sortBy) return filteredTasks;

        return [...filteredTasks].sort((a, b) => {
            switch (filters.sortBy) {
                case 'dueDate':
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                default:
                    return 0;
            }
        });
    };

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/tasks`);
            setTasks(response.data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to fetch tasks');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (taskData) => {
        try {
            const response = await axios.post(`${API_URL}/api/tasks`, taskData);
            // Don't update state here, let the socket handle it
            toast.success('Task created successfully');
            return response.data;
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error('Failed to create task');
            throw error;
        }
    };

    const updateTask = async (taskId, taskData) => {
        try {
            const response = await axios.put(`${API_URL}/api/tasks/${taskId}`, taskData);
            // Don't update state here, let the socket handle it
            toast.success('Task updated successfully');
            return response.data;
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error('Failed to update task');
            throw error;
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`${API_URL}/api/tasks/${taskId}`);
            // Don't update state here, let the socket handle it
            toast.success('Task deleted successfully');
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
            throw error;
        }
    };

    // Socket event handlers
    useEffect(() => {
        if (!socket) return;

        const handleTaskCreated = (newTask) => {
            setTasks(prev => {
                // Check if task already exists
                if (prev.some(task => task._id === newTask._id)) {
                    return prev;
                }
                return [...prev, newTask];
            });
        };

        const handleTaskUpdated = (updatedTask) => {
            setTasks(prev => prev.map(task =>
                task._id === updatedTask._id ? updatedTask : task
            ));
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
    }, [socket]);

    // Fetch tasks initially
    useEffect(() => {
        fetchTasks();
    }, []);

    // Get filtered and sorted tasks
    const filteredTasks = getFilteredTasks();
    const sortedAndFilteredTasks = getSortedTasks(filteredTasks);

    return (
        <TaskContext.Provider value={{
            tasks: sortedAndFilteredTasks,
            loading,
            filters,
            setFilters,
            createTask,
            updateTask,
            deleteTask,
            fetchTasks
        }}>
            {children}
        </TaskContext.Provider>
    );
};