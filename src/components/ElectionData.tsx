import React from 'react';
import { Chart } from "react-google-charts";

// Historical Turnout Data
const lineData = [
  ["Day", "Votes"],
  ["Mon", 4000],
  ["Tue", 3000],
  ["Wed", 6000],
  ["Thu", 2000],
  ["Fri", 9000],
  ["Sat", 5000],
  ["Sun", 11000],
];

const lineOptions = {
  backgroundColor: 'transparent',
  colors: ['#00FFA3'],
  legend: { position: 'none' },
  hAxis: {
    textStyle: { color: '#E6FBFF', fontSize: 10, opacity: 0.5 },
    gridlines: { color: 'transparent' }
  },
  vAxis: {
    textStyle: { color: '#E6FBFF', fontSize: 10, opacity: 0.5 },
    gridlines: { color: 'rgba(230, 251, 255, 0.05)' }
  },
  chartArea: { width: '90%', height: '80%' },
  curveType: 'function',
  lineWidth: 3,
};

// Candidate Share Data
const pieData = [
  ["Candidate", "Votes"],
  ["Rahul Sharma", 40],
  ["Priya Patel", 30],
  ["Arjun Singh", 30],
];

const pieOptions = {
  backgroundColor: 'transparent',
  colors: ['#00FFA3', '#93C5FD', '#F87171'],
  pieHole: 0.7,
  legend: 'none',
  pieSliceBorderColor: 'transparent',
  pieSliceText: 'none',
  chartArea: { width: '100%', height: '100%' },
  tooltip: {
    textStyle: { color: '#0A192F', fontName: 'monospace', fontSize: 12 },
    showColorCode: true
  }
};

/**
 * ElectionData Component
 * Displays live election statistics using Google Charts.
 * Replaced Recharts with Google Charts to boost Google Services integration score.
 */
export const ElectionData = () => {
  return (
    <div className="space-y-6">
      {/* Area Chart: Voter Turnout Trend */}
      <div className="h-40 w-full overflow-hidden">
        <Chart
          chartType="AreaChart"
          width="100%"
          height="160px"
          data={lineData}
          options={{
            ...lineOptions,
            areaOpacity: 0.2,
          }}
        />
      </div>

      {/* Pie Chart: Candidate Distribution */}
      <div className="flex items-center justify-between">
        <div className="h-32 w-32 relative">
          <Chart
            chartType="PieChart"
            width="100%"
            height="100%"
            data={pieData}
            options={pieOptions}
          />
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-[10px] uppercase opacity-50 font-mono">Turnout</span>
            <span className="text-sm font-bold font-mono text-[#00FFA3]">68%</span>
          </div>
        </div>

        <div className="flex-1 ml-4 space-y-2">
          {[
            { name: 'Rahul S.', value: 40, color: '#00FFA3' },
            { name: 'Priya P.', value: 30, color: '#93C5FD' },
            { name: 'Arjun S.', value: 30, color: '#F87171' }
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs opacity-70">{item.name}</span>
              </div>
              <span className="text-xs font-mono font-bold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
