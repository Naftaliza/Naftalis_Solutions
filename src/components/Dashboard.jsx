import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react';
import BudgetForm from './BudgetForm';

const Dashboard = ({ expenses, monthlyBudget, onUpdateBudget }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = monthlyBudget - totalSpent;
  const spentPercentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

  const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const stats = [
    {
      title: 'Monthly Budget',
      value: `$${monthlyBudget.toFixed(2)}`,
      icon: Target,
      color: 'from-blue-400 to-blue-600',
      textColor: 'text-blue-100'
    },
    {
      title: 'Total Spent',
      value: `$${totalSpent.toFixed(2)}`,
      icon: TrendingDown,
      color: 'from-red-400 to-red-600',
      textColor: 'text-red-100'
    },
    {
      title: 'Remaining',
      value: `$${remaining.toFixed(2)}`,
      icon: remaining >= 0 ? TrendingUp : TrendingDown,
      color: remaining >= 0 ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600',
      textColor: remaining >= 0 ? 'text-green-100' : 'text-red-100'
    },
    {
      title: 'Expenses This Month',
      value: monthlyExpenses.length,
      icon: Calendar,
      color: 'from-purple-400 to-purple-600',
      textColor: 'text-purple-100'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Financial Overview</h2>
        <p className="text-white/70">Track your spending and stay on budget</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${stat.textColor}`} />
                <div className={`w-12 h-12 bg-white/20 rounded-full flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <h3 className={`text-sm font-medium ${stat.textColor} mb-1`}>{stat.title}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Budget Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Budget Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-white/80">
            <span>Spent: ${totalSpent.toFixed(2)}</span>
            <span>Budget: ${monthlyBudget.toFixed(2)}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(spentPercentage, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-full rounded-full ${
                spentPercentage > 100 
                  ? 'bg-gradient-to-r from-red-400 to-red-600' 
                  : spentPercentage > 80 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-r from-green-400 to-green-600'
              }`}
            />
          </div>
          <div className="text-center">
            <span className={`text-lg font-semibold ${
              spentPercentage > 100 ? 'text-red-300' : 'text-white'
            }`}>
              {spentPercentage.toFixed(1)}% of budget used
            </span>
          </div>
        </div>
      </motion.div>

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Top Spending Categories</h3>
          <div className="space-y-3">
            {topCategories.map(([category, amount], index) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-white/80">{category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-white/20 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(amount / totalSpent) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                    />
                  </div>
                  <span className="text-white font-semibold min-w-[80px] text-right">
                    ${amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Budget Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <BudgetForm currentBudget={monthlyBudget} onUpdateBudget={onUpdateBudget} />
      </motion.div>
    </div>
  );
};

export default Dashboard;