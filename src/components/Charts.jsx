import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';

const Charts = ({ expenses }) => {
  const [timeframe, setTimeframe] = useState('monthly');

  const getFilteredExpenses = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentWeek = getWeekNumber(now);

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const expenseYear = expenseDate.getFullYear();
      const expenseMonth = expenseDate.getMonth();
      const expenseWeek = getWeekNumber(expenseDate);

      if (timeframe === 'weekly') {
        return expenseYear === currentYear && expenseWeek === currentWeek;
      } else if (timeframe === 'monthly') {
        return expenseYear === currentYear && expenseMonth === currentMonth;
      } else if (timeframe === 'yearly') {
        return expenseYear === currentYear;
      }
      return true;
    });
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const filteredExpenses = getFilteredExpenses();

  // Category breakdown
  const categoryData = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const categoryEntries = Object.entries(categoryData).sort(([,a], [,b]) => b - a);
  const totalAmount = Object.values(categoryData).reduce((sum, amount) => sum + amount, 0);

  // Daily spending for the current month
  const getDailySpending = () => {
    const dailyData = {};
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    // Initialize all days with 0
    for (let i = 1; i <= daysInMonth; i++) {
      dailyData[i] = 0;
    }

    // Add actual spending
    filteredExpenses.forEach(expense => {
      const day = new Date(expense.date).getDate();
      dailyData[day] = (dailyData[day] || 0) + expense.amount;
    });

    return Object.entries(dailyData).map(([day, amount]) => ({ day: parseInt(day), amount }));
  };

  const dailySpending = getDailySpending();
  const maxDailyAmount = Math.max(...dailySpending.map(d => d.amount));

  const colors = [
    'from-red-400 to-red-600',
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-yellow-400 to-yellow-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-indigo-400 to-indigo-600',
    'from-cyan-400 to-cyan-600'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Expense Analytics</h2>
        <p className="text-white/70">Visualize your spending patterns</p>
      </div>

      {/* Timeframe Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center gap-2"
      >
        {[
          { value: 'weekly', label: 'This Week' },
          { value: 'monthly', label: 'This Month' },
          { value: 'yearly', label: 'This Year' }
        ].map(option => (
          <button
            key={option.value}
            onClick={() => setTimeframe(option.value)}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              timeframe === option.value
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </motion.div>

      {filteredExpenses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-white/60"
        >
          <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No expenses found for this period</p>
          <p>Start adding expenses to see your analytics</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6" />
              Spending by Category
            </h3>
            
            <div className="space-y-4">
              {categoryEntries.map(([category, amount], index) => {
                const percentage = (amount / totalAmount) * 100;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">{category}</span>
                      <div className="text-right">
                        <span className="text-white font-semibold">${amount.toFixed(2)}</span>
                        <span className="text-white/60 text-sm ml-2">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Total Spent</span>
                <span className="text-2xl font-bold text-white">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Daily Spending Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Daily Spending ({timeframe === 'monthly' ? 'This Month' : timeframe === 'weekly' ? 'This Week' : 'This Year'})
            </h3>
            
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {dailySpending.slice(0, timeframe === 'weekly' ? 7 : 31).map((day, index) => (
                <div key={day.day} className="flex items-center gap-3">
                  <span className="text-white/60 text-sm w-8">
                    {timeframe === 'weekly' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index] : day.day}
                  </span>
                  <div className="flex-1 bg-white/20 rounded-full h-6 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: maxDailyAmount > 0 ? `${(day.amount / maxDailyAmount) * 100}%` : '0%' }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.05 }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                    />
                    {day.amount > 0 && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                        ${day.amount.toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 text-white">
          <Calendar className="w-8 h-8 mb-3 opacity-80" />
          <h4 className="text-lg font-semibold mb-1">Total Expenses</h4>
          <p className="text-3xl font-bold">{filteredExpenses.length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white">
          <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
          <h4 className="text-lg font-semibold mb-1">Average per Day</h4>
          <p className="text-3xl font-bold">
            ${timeframe === 'monthly' ? (totalAmount / new Date().getDate()).toFixed(2) : 
               timeframe === 'weekly' ? (totalAmount / 7).toFixed(2) : 
               (totalAmount / new Date().getDate()).toFixed(2)}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 text-white">
          <PieChart className="w-8 h-8 mb-3 opacity-80" />
          <h4 className="text-lg font-semibold mb-1">Top Category</h4>
          <p className="text-xl font-bold">
            {categoryEntries.length > 0 ? categoryEntries[0][0] : 'None'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Charts;