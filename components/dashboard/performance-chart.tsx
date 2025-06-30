"use client";

import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/**
 * Generates mock performance data for a 30-day period.
 * The data simulates daily value changes with a mix of positive and negative fluctuations.
 *
 * @returns {Array<{ day: number; value: string }>} An array of data points for the chart.
 */
const generateData = () => {
  const data = [];
  let value = 100; // Starting value for the chart

  for (let i = 0; i < 30; i++) {
    // Generate a random daily change between -3% and +5%
    const change = (Math.random() * 8 - 3) / 100;
    value = value * (1 + change); // Apply the change to the current value

    data.push({
      day: i + 1, // Day number
      value: value.toFixed(2), // Value rounded to 2 decimal places as a string
    });
  }

  return data;
};

/**
 * PerformanceChart component displays a responsive line chart showing performance data.
 * The data is mock-generated and updates on component mount.
 *
 * @returns {JSX.Element} A responsive container holding the LineChart.
 */
export function PerformanceChart() {
  const [data, setData] = useState<any[]>([]); // State to hold the chart data

  /**
   * useEffect hook to generate and set the initial chart data when the component mounts.
   */
  useEffect(() => {
    setData(generateData());
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        {/* X-Axis configuration for days */}
        <XAxis
          dataKey="day"
          tickLine={false} // Hide tick lines
          axisLine={false} // Hide axis line
          tickFormatter={(value) => `Day ${value}`} // Format tick labels as "Day X"
          tick={{ fontSize: 12, fill: "#6B7280" }} // Style for tick labels
        />
        {/* Y-Axis configuration for values */}
        <YAxis
          tickLine={false} // Hide tick lines
          axisLine={false} // Hide axis line
          tickFormatter={(value) => `$${value}`} // Format tick labels as currency
          tick={{ fontSize: 12, fill: "#6B7280" }} // Style for tick labels
        />
        {/* Tooltip configuration for displaying data on hover */}
        <Tooltip
          formatter={(value: string) => [`$${value}`, "Value"]} // Format tooltip value
          labelFormatter={(label: number) => `Day ${label}`} // Format tooltip label
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            border: "1px solid #E5E7EB",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        />
        {/* Line series for the performance data */}
        <Line
          type="monotone" // Smooth curve type
          dataKey="value" // Data key to plot
          stroke="#14B8A6" // Teal color for the line
          strokeWidth={2} // Line thickness
          dot={false} // Do not display dots on the line
          activeDot={{ r: 6, fill: "#14B8A6", stroke: "white", strokeWidth: 2 }} // Style for active dot on hover
        />
      </LineChart>
    </ResponsiveContainer>
  );
}