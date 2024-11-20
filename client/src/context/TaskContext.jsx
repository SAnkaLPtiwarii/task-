import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useSocket } from '../hooks/useSocket';

export const TaskContext = createContext(null);

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/tasks');
            setTasks(response.data);
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
            return response.data;
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error('Failed to create task');
            throw error;
        }
    };

    // Socket connection effect
    useEffect(() => {
        if (socket) {
            socket.on('taskCreated', (newTask) => {
                setTasks(prev => [...prev, newTask]);
                toast.success('New task received');
            });

            socket.on('taskUpdated', (updatedTask) => {
                setTasks(prev =>
                    prev.map(task => task._id === updatedTask._id ? updatedTask : task)
                );
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