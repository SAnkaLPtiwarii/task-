import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Welcome = ({ onContinue }) => {
    const [name, setName] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    const handleContinue = () => {
        if (name.trim()) {
            setIsAnimating(true);
            setTimeout(() => {
                onContinue(name);
            }, 500);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-lg"
            >
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-6"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.02, 1],
                            rotate: [0, 1, -1, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        className="w-24 h-24 mx-auto bg-purple-100 rounded-2xl flex items-center justify-center"
                    >
                        <span className="text-4xl">✨</span>
                    </motion.div>

                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Welcome to Task Manager
                        </h1>
                        <p className="text-gray-600">
                            Let's start by getting to know you
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <motion.input
                                whileFocus={{ scale: 1.02 }}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-6 py-4 text-lg rounded-xl border-2 border-purple-100 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-300"
                            />
                            <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: name.length > 0 ? '100%' : '0%' }}
                                className="absolute bottom-0 left-0 h-0.5 bg-purple-500 rounded-full"
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleContinue}
                            disabled={!name.trim()}
                            className={`
                w-full px-6 py-4 rounded-xl text-lg font-medium text-white
                transition-colors duration-300
                ${name.trim()
                                    ? 'bg-purple-600 hover:bg-purple-700 cursor-pointer'
                                    : 'bg-gray-300 cursor-not-allowed'}
              `}
                        >
                            Continue to Task Manager
                        </motion.button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        transition={{ delay: 0.5 }}
                        className="text-sm text-gray-500"
                    >
                        Your tasks, organized beautifully
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Welcome;