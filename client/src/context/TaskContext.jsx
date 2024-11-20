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

    // Fetch tasks with filters
    const fetchTasks = async () => {
        try {
            setLoading(true);
            let url = `${API_URL}/api/tasks`;

            // Add query parameters for filters
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);

            const queryString = params.toString();
            if (queryString) url += `?${queryString}`;

            const response = await axios.get(url);
            setTasks(response.data || []);
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
            const response = await axios.post(`${API_URL}/api/tasks`, taskData);
            setTasks(prev => [...prev, response.data]);
            toast.success('Task created successfully');
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error('Failed to create task');
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
        }
    };

    // Sort tasks
    const sortTasks = (tasksToSort, sortBy) => {
        if (!sortBy) return tasksToSort;

        return [...tasksToSort].sort((a, b) => {
            switch (sortBy) {
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

    // Effect for filters
    useEffect(() => {
        fetchTasks();
    }, [filters]);

    // Socket effects
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

    const value = {
        tasks: sortTasks(tasks, filters.sortBy),
        loading,
        filters,
        setFilters,
        createTask,
        updateTask,
        deleteTask,
        fetchTasks
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};