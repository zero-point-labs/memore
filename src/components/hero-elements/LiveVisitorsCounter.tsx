'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';

export default function LiveVisitorsCounter() {
  const [visitors, setVisitors] = useState(127);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  useEffect(() => {
    // Simulate live visitor count changes
    const visitorInterval = setInterval(() => {
      setVisitors((prev) => {
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        return Math.max(50, Math.min(300, prev + change));
      });
    }, 5000);

    // Simulate recent activity
    const activities = [
      'Someone from Nicosia just viewed this page',
      'New booking started from Limassol',
      'Student from UCY joined the waitlist',
      'VIP pass claimed by Maria K.',
      'Group booking inquiry from Larnaca',
    ];

    const activityInterval = setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setRecentActivity((prev) => [randomActivity, ...prev.slice(0, 2)]);
    }, 8000);

    return () => {
      clearInterval(visitorInterval);
      clearInterval(activityInterval);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2">
      {/* Recent Activity Feed */}
      <AnimatePresence>
        {recentActivity.slice(0, 1).map((activity) => (
          <motion.div
            key={`${activity}-${Date.now()}`}
            initial={{ opacity: 0, x: -50, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -50, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-purple-900/90 backdrop-blur-md rounded-lg px-4 py-3 border border-purple-500/40 max-w-xs shadow-lg"
          >
            <p className="text-sm text-purple-200 whitespace-nowrap">{activity}</p>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Live Visitor Count */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-black/95 backdrop-blur-md rounded-lg px-4 py-2 border border-purple-500/40 flex items-center gap-3 shadow-lg"
      >
        <div className="relative">
          <Users className="w-4 h-4 text-purple-400" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={visitors}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-white font-medium"
          >
            {visitors} live visitors
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}