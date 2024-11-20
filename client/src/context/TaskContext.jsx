import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSocket } from '../hooks/useSocket';

const TaskContext = createContext();

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
    const [filters, setFilters] = useState({ status: '', sortBy: '' }); // Initialize filters
    const socket = useSocket();

    const API_URL = import.meta.env.VITE_API_URL || 'https://taskoo-g77y.onrender.com';

    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });

    // Fetch tasks
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/tasks');
            setTasks(response.data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to fetch tasks');
            setTasks([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    // Create task
    const createTask = async (taskData) => {
        try {
            const response = await api.post('/api/tasks', taskData);
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
            const response = await api.put(`/api/tasks/${taskId}`, taskData);
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
            await api.delete(`/api/tasks/${taskId}`);
            setTasks(prev => prev.filter(task => task._id !== taskId));
            toast.success('Task deleted successfully');
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
        }
    };

    // Socket connection effect
    useEffect(() => {
        if (!socket) return;

        const handleTaskCreated = (newTask) => {
            setTasks(prev => [...prev, newTask]);
            toast.success('New task added');
        };

        const handleTaskUpdated = (updatedTask) => {
            setTasks(prev => prev.map(task =>
                task._id === updatedTask._id ? updatedTask : task
            ));
            toast.success('Task updated');
        };

        const handleTaskDeleted = (taskId) => {
            setTasks(prev => prev.filter(task => task._id !== taskId));
            toast.success('Task deleted');
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

    // Initial fetch
    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <TaskContext.Provider value={{
            tasks,
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