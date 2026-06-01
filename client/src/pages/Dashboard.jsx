import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import FAB from '../components/FAB';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [txRes, bRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/budgets')
      ]);
      setTransactions(txRes.data);
      setBudgets(bRes.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Calculations
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="glass-panel rounded-none border-t-0 border-l-0 border-r-0 px-6 py-4 flex justify-between items-center mb-8 sticky top-0 z-40">
        <h1 className="text-xl font-bold bg-gradient-to-r from-gravity-primary to-gravity-secondary bg-clip-text text-transparent">Gravity Finance</h1>
        <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white transition-colors">Logout</button>
      </header>

      <main className="max-w-6xl mx-auto px-6 space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-6">
            <div className="text-sm text-gray-400 mb-1">Net Balance</div>
            <div className="text-3xl font-bold">${netBalance.toLocaleString()}</div>
          </div>
          <div className="glass-panel p-6">
            <div className="text-sm text-gray-400 mb-1">Total Income</div>
            <div className="text-2xl font-semibold text-gravity-primary">+${totalIncome.toLocaleString()}</div>
          </div>
          <div className="glass-panel p-6">
            <div className="text-sm text-gray-400 mb-1">Total Expenses</div>
            <div className="text-2xl font-semibold text-red-400">-${totalExpenses.toLocaleString()}</div>
          </div>
          <div className="glass-panel p-6">
            <div className="text-sm text-gray-400 mb-1">Savings Rate</div>
            <div className="text-2xl font-semibold text-gravity-secondary">{savingsRate.toFixed(1)}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 glass-panel p-6">
            <h2 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">Recent Transactions</h2>
            <div className="space-y-4">
              {transactions.length === 0 && <p className="text-gray-500 text-sm">No transactions yet.</p>}
              {transactions.slice(0, 5).map(tx => (
                <div key={tx._id} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors">
                  <div>
                    <div className="font-medium">{tx.description}</div>
                    <div className="text-xs text-gray-400">{tx.category} • {new Date(tx.date).toLocaleDateString()}</div>
                  </div>
                  <div className={`font-semibold ${tx.type === 'income' ? 'text-gravity-primary' : 'text-white'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Tracking Preview */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">Budget Tracking</h2>
            <div className="space-y-6">
              {budgets.length === 0 && <p className="text-gray-500 text-sm">No budgets set.</p>}
              {budgets.map(b => {
                const spent = transactions
                  .filter(t => t.type === 'expense' && t.category === b.category)
                  .reduce((sum, t) => sum + t.amount, 0);
                const pct = Math.min((spent / b.limit) * 100, 100);
                
                return (
                  <div key={b._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{b.category}</span>
                      <span className="text-gray-400">${spent} / ${b.limit}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${pct > 90 ? 'bg-red-500' : 'bg-gravity-accent'}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </main>

      <FAB onTransactionAdded={fetchData} />
    </div>
  );
};

export default Dashboard;
