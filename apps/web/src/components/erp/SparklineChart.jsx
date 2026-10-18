import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const SparklineChart = ({ data, color, height = 50, width = "100%" }) => {
  // Ensure data is in the format recharts expects: [{ value: 10 }, { value: 20 }]
  const chartData = data.map((val, idx) => ({ i: idx, value: val }));

  return (
    <div style={{ height, width }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2} 
            dot={false}
            animationDuration={1500} 
          />
          {/* Hidden YAxis to auto-scale the line properly */}
          <YAxis domain={['dataMin', 'dataMax']} hide={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SparklineChart;