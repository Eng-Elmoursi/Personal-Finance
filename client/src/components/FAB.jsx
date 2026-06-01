import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Target, X } from 'lucide-react';
import api from '../api';

const FAB = ({ onTransactionAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'income', 'expense', 'goal'
  
  // Form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  
  const incomeCategories = ['Salary', 'Freelance', 'Business', 'Investments', 'Gifts', 'Other'];
  const expenseCategories = ['Food', 'Transportation', 'Shopping', 'Education', 'Fitness', 'Entertainment', 'Bills', 'Healthcare', 'Travel', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'income' || modalType === 'expense') {
        await api.post('/transactions', {
          type: modalType,
          amount: parseFloat(amount),
          category,
          description
        });
      } else if (modalType === 'goal') {
        await api.post('/goals', {
          title: description, // using description field as title for simplicity
          targetAmount: parseFloat(amount)
        });
      }
      
      setModalType(null);
      setIsOpen(false);
      setAmount('');
      setCategory('');
      setDescription('');
      onTransactionAdded();
    } catch (err) {
      alert('Error adding entry');
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        {isOpen && (
          <div className="flex flex-col gap-3 mb-4 items-end animate-in slide-in-from-bottom-5">
            <button 
              onClick={() => { setModalType('income'); setIsOpen(false); }}
              className="flex items-center gap-3 bg-gravity-surface border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <span>Add Income</span>
              <div className="bg-green-500/20 text-green-400 p-2 rounded-full"><TrendingUp size={16} /></div>
            </button>
            <button 
              onClick={() => { setModalType('expense'); setIsOpen(false); }}
              className="flex items-center gap-3 bg-gravity-surface border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <span>Add Expense</span>
              <div className="bg-red-500/20 text-red-400 p-2 rounded-full"><TrendingDown size={16} /></div>
            </button>
            <button 
              onClick={() => { setModalType('goal'); setIsOpen(false); }}
              className="flex items-center gap-3 bg-gravity-surface border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <span>Add Goal</span>
              <div className="bg-gravity-accent/20 text-gravity-accent p-2 rounded-full"><Target size={16} /></div>
            </button>
          </div>
        )}
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-gravity-base shadow-lg transition-transform ${isOpen ? 'bg-white rotate-45' : 'bg-gravity-primary hover:scale-105'}`}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel p-6 w-full max-w-md relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setModalType(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold mb-6 capitalize">Add {modalType}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    className="glass-input pl-8" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {modalType !== 'goal' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select 
                    className="glass-input appearance-none" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {(modalType === 'income' ? incomeCategories : expenseCategories).map(cat => (
                      <option key={cat} value={cat} className="bg-gravity-base">{cat}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  {modalType === 'goal' ? 'Goal Title' : 'Description'}
                </label>
                <input 
                  type="text" 
                  className="glass-input" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="btn-primary w-full mt-4">Save</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FAB;
