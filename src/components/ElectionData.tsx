import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Mon', votes: 4000 },
  { name: 'Tue', votes: 3000 },
  { name: 'Wed', votes: 6000 },
  { name: 'Thu', votes: 2000 },
  { name: 'Fri', votes: 9000 },
  { name: 'Sat', votes: 5000 },
  { name: 'Sun', votes: 11000 },
];

const pieData = [
  { name: 'Rahul S.', value: 400 },
  { name: 'Priya P.', value: 300 },
  { name: 'Arjun S.', value: 300 },
];

const COLORS = ['#00FFA3', '#E6FBFF', 'rgba(230, 251, 255, 0.3)'];

export const ElectionData = () => {
  return (
    <div className="space-y-6">
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00FFA3" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00FFA3" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ background: 'rgba(10, 25, 47, 0.9)', border: '1px solid rgba(0, 255, 163, 0.3)', borderRadius: '8px' }}
              itemStyle={{ color: '#E6FBFF' }}
            />
            <Area type="monotone" dataKey="votes" stroke="#00FFA3" fillOpacity={1} fill="url(#colorVotes)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
 <div className="flex items-center justify-between">
        <div className="h-32 w-32 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={35}
                outerRadius={45}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-[10px] uppercase opacity-50 font-mono">Turnout</span>
            <span className="text-sm font-bold font-mono text-[#00FFA3]">68%</span>
          </div>
        </div>

        <div className="flex-1 ml-4 space-y-2">
          {pieData.map((item, i) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs opacity-70">{item.name}</span>
              </div>
              <span className="text-xs font-mono font-bold">{item.value / 10}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
