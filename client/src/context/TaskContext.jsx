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
    const socket = useSocket();

    const API_URL = import.meta.env.VITE_API_URL;

    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/tasks');
            setTasks(response.data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

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

    // Improved delete task function
    const deleteTask = async (taskId) => {
        try {
            // Optimistic update
            setTasks(prev => prev.filter(task => task._id !== taskId));

            await api.delete(`/api/tasks/${taskId}`);
            toast.success('Task deleted successfully');
        } catch (error) {
            // Revert on error
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
            // Reload tasks to ensure consistency
            fetchTasks();
        }
    };

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

            socket.on('taskDeleted', (deletedTaskId) => {
                setTasks(prev => prev.filter(task => task._id !== deletedTaskId));
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

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <TaskContext.Provider value={{
            tasks,
            loading,
            createTask,
            updateTask,
            deleteTask,
            fetchTasks
        }}>
            {children}
        </TaskContext.Provider>
    );
};