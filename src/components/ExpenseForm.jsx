import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ExpenseForm = ({ onAddExpense }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: ''
  });

  const categories = [
    'Food', 'Transportation', 'Entertainment', 'Utilities', 
    'Shopping', 'Health', 'Education', 'Travel', 'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before adding the expense.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount.",
        variant: "destructive"
      });
      return;
    }

    onAddExpense({
      amount,
      category: formData.category,
      description: formData.description
    });

    setFormData({ amount: '', category: '', description: '' });
    
    toast({
      title: "Expense Added! 💰",
      description: `Successfully added $${amount.toFixed(2)} expense.`
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Add New Expense</h2>
        <p className="text-white/70">Track your spending to stay on budget</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 space-y-6"
      >
        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-white font-medium block">Amount</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-white font-medium block">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
          >
            <option value="" className="bg-gray-800">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category} className="bg-gray-800">
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label className="text-white font-medium block">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What did you spend on?"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
          />
        </div>

        {/* Submit Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Add Expense
          </Button>
        </motion.div>
      </motion.form>

      {/* Quick Add Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <h3 className="text-white font-medium mb-4 text-center">Quick Add</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { amount: 5, desc: 'Coffee', cat: 'Food' },
            { amount: 15, desc: 'Lunch', cat: 'Food' },
            { amount: 25, desc: 'Gas', cat: 'Transportation' },
            { amount: 10, desc: 'Snacks', cat: 'Food' },
            { amount: 50, desc: 'Groceries', cat: 'Food' },
            { amount: 20, desc: 'Parking', cat: 'Transportation' }
          ].map((quick, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onAddExpense({
                  amount: quick.amount,
                  category: quick.cat,
                  description: quick.desc
                });
                toast({
                  title: "Quick Expense Added! ⚡",
                  description: `Added $${quick.amount} for ${quick.desc}.`
                });
              }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/20 text-white text-sm font-medium transition-all"
            >
              ${quick.amount} {quick.desc}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ExpenseForm;