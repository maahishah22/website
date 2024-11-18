import React from 'react';
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';

function BarChartDashboard({ budgetList }) {
  return (
    <div className="p-10 bg-gradient-to-b from-black via-gray-900 to-gray-950 rounded-lg">
      <h2 className="font-bold text-3xl text-white mb-6">Activity</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={budgetList}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" tick={{ fill: '#fff' }} />
            <YAxis tick={{ fill: '#fff' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#2d2d2d',
                borderRadius: '8px',
                border: 'none',
                color: '#fff',
              }}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar dataKey="totalSpend" stackId="a" fill="#4845d2" /> {/* Violet */}
            <Bar dataKey="amount" stackId="a" fill="#C3C2FF" /> {/* Lighter Violet */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BarChartDashboard;
