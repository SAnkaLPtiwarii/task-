import React, { useState, useEffect } from 'react';
import { TaskProvider } from './context/TaskContext';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import Notification from './components/Notification';
import Welcome from './components/Welcome';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('taskManagerUserName') || '';
  });
  const [showWelcome, setShowWelcome] = useState(!userName);

  const handleContinue = (name) => {
    setUserName(name);
    localStorage.setItem('taskManagerUserName', name);
    setShowWelcome(false);
  };

  return (
    <AnimatePresence mode='wait'>
      {showWelcome ? (
        <Welcome key="welcome" onContinue={handleContinue} />
      ) : (
        <TaskProvider key="taskManager">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl font-bold text-indigo-900 mb-2">
                  Welcome back, {userName}! 👋
                </h1>
                <p className="text-lg text-indigo-600">
                  Let's manage your tasks efficiently
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    localStorage.removeItem('taskManagerUserName');
                    setShowWelcome(true);
                  }}
                  className="mt-4 text-sm text-purple-600 hover:text-purple-700 underline"
                >
                  Not {userName}? Change user
                </motion.button>
              </motion.div>

              <TaskStats />

              <div className="grid gap-8 md:grid-cols-[450px,1fr]">
                <div className="space-y-6">
                  <div className="sticky top-8">
                    <TaskForm />
                  </div>
                </div>

                <div className="space-y-6">
                  <TaskList />
                </div>
              </div>
            </div>
            <Notification />
          </motion.div>
        </TaskProvider>
      )}
    </AnimatePresence>
  );
}

export default App; 