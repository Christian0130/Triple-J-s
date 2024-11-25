import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const SalesTrendChart = ({ salesTrend }) => {
  // Transform data for the chart
  const chartData = salesTrend.map(item => ({
    date: moment(item.date).format('YYYY-MM-DD'),  // Format the date
    dailySales: item.dailySales
  }));

  return (
    <div style={{ height: 400, width: '100%' }}>
      <h3>Sales Trend</h3>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="dailySales" stroke="#3f51b5" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesTrendChart;
