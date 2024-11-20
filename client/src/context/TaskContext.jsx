import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSocket } from '../hooks/useSocket';

const TaskContext = createContext();

export function useTaskContext() {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
}

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        sortBy: ''
    });

    const socket = useSocket();
    const API_URL = import.meta.env.VITE_API_URL;

    // Fetch tasks
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/tasks`);
            setTasks(response.data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    // Create task
    const createTask = async (taskData) => {
        try {
            const response = await axios.post(`${API_URL}/api/tasks`, taskData);
            setTasks(prev => [...prev, response.data]);
            toast.success('Task created successfully');
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error('Failed to create task');
            throw error;
        }
    };

    // Update task
    const updateTask = async (taskId, taskData) => {
        try {
            const response = await axios.put(`${API_URL}/api/tasks/${taskId}`, taskData);
            setTasks(prev => prev.map(task =>
                task._id === taskId ? response.data : task
            ));
            toast.success('Task updated successfully');
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error('Failed to update task');
            throw error;
        }
    };

    // Delete task
    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`${API_URL}/api/tasks/${taskId}`);
            setTasks(prev => prev.filter(task => task._id !== taskId));
            toast.success('Task deleted successfully');
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
            throw error;
        }
    };

    // Get filtered and sorted tasks
    const getFilteredAndSortedTasks = () => {
        let filteredTasks = [...tasks];

        // Apply filters
        if (filters.status) {
            filteredTasks = filteredTasks.filter(task => task.status === filters.status);
        }
        if (filters.priority) {
            filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
        }

        // Apply sorting
        if (filters.sortBy) {
            filteredTasks.sort((a, b) => {
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
        }

        return filteredTasks;
    };

    // Socket event handlers
    useEffect(() => {
        if (!socket) return;

        socket.on('taskCreated', (newTask) => {
            setTasks(prev => [...prev, newTask]);
        });

        socket.on('taskUpdated', (updatedTask) => {
            setTasks(prev => prev.map(task =>
                task._id === updatedTask._id ? updatedTask : task
            ));
        });

        socket.on('taskDeleted', (taskId) => {
            setTasks(prev => prev.filter(task => task._id !== taskId));
        });

        return () => {
            socket.off('taskCreated');
            socket.off('taskUpdated');
            socket.off('taskDeleted');
        };
    }, [socket]);

    // Initial fetch
    useEffect(() => {
        fetchTasks();
    }, []);

    const value = {
        tasks: getFilteredAndSortedTasks(),
        loading,
        filters,
        setFilters,
        createTask,
        updateTask,
        deleteTask,
        fetchTasks
    };

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}