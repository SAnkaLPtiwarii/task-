import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSocket } from '../hooks/useSocket';

// Create Context
const TaskContext = createContext();

// Custom Hook for using the context
export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};

// Provider Component
export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();

    // Fetch tasks
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://taskoo-g77y.onrender.com/api/tasks');
            setTasks(response.data);
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
            const response = await axios.post('https://taskoo-g77y.onrender.com/api/tasks', taskData);
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
            const response = await axios.put(`https://taskoo-g77y.onrender.com/api/tasks/${taskId}`, taskData);
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
            await axios.delete(`https://taskoo-g77y.onrender.com/api/tasks/${taskId}`);
            setTasks(prev => prev.filter(task => task._id !== taskId));
            toast.success('Task deleted successfully');
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
        }
    };

    // Socket event handlers
    useEffect(() => {
        if (socket) {
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
        }

        return () => {
            if (socket) {
                socket.off('taskCreated');
                socket.off('taskUpdated');
                socket.off('taskDeleted');
            }
        };
    }, [socket]);

    // Initial fetch
    useEffect(() => {
        fetchTasks();
    }, []);

    // Context value
    const value = {
        tasks,
        loading,
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