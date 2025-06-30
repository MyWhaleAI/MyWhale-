"use client";

import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/**
 * Generates mock performance data for a given number of days and a trend.
 * @param {number} days - The number of data points (days) to generate.
 * @param {"up" | "down" | "mixed"} trend - The general trend of the data.
 * @returns {Array<{ day: number; value: number }>} An array of data points.
 */
const generatePerformanceData = (days: number, trend: "up" | "down" | "mixed") => {
  const data = [];
  let value = 100; // Starting value for the chart

  for (let i = 0; i < days; i++) {
    let change;
    if (trend === "up") {
      change = (Math.random() * 5 - 1) / 100; // -1% to +4% change, generally upward
    } else if (trend === "down") {
      change = (Math.random() * 5 - 4) / 100; // -4% to +1% change, generally downward
    } else {
      change = (Math.random() * 8 - 4) / 100; // -4% to +4% change, mixed
    }

    value = value * (1 + change); // Apply change to the value

    data.push({
      day: i + 1, // Day number
      value: Number.parseFloat(value.toFixed(2)), // Value rounded to 2 decimal places
    });
  }

  return data;
};

/**
 * Props for the WhalePerformanceMetrics component.
 * @interface WhalePerformanceMetricsProps
 * @property {string} address - The wallet address of the whale (currently not used for data fetching, but for context).
 */
interface WhalePerformanceMetricsProps {
  address: string;
}

/**
 * WhalePerformanceMetrics component displays a performance chart and key metrics
 * for a whale over different time periods (7d, 30d, 90d).
 * The chart data is currently mock-generated.
 *
 * @param {WhalePerformanceMetricsProps} { address } - The props object containing the whale's address.
 * @returns {JSX.Element} The rendered performance metrics card.
 */
export function WhalePerformanceMetrics({ address }: WhalePerformanceMetricsProps) {
  // Generate different data sets for different time periods using mock data
  const weekData = generatePerformanceData(7, "up");
  const monthData = generatePerformanceData(30, "mixed");
  const quarterData = generatePerformanceData(90, "up");

  // State for the active time period tab (7d, 30d, 90d)
  const [activeTimePeriod, setActiveTimePeriod] = React.useState("30d");

  // Select the appropriate chart data based on the active time period
  const chartData = activeTimePeriod === "7d" ? weekData : activeTimePeriod === "30d" ? monthData : quarterData;

  // Calculate performance metrics based on the selected chart data
  const startValue = chartData[0].value;
  const endValue = chartData[chartData.length - 1].value;
  const percentChange = ((endValue - startValue) / startValue) * 100;

  // Find the highest and lowest points in the current chart data
  const highestPoint = Math.max(...chartData.map((d) => d.value));
  const lowestPoint = Math.min(...chartData.map((d) => d.value));

  return (
    <Card className="bg-white border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
        <CardTitle className="text-lg font-bold">Performance</CardTitle>
        {/* Tabs for selecting time period */}
        <Tabs value={activeTimePeriod} className="w-full">
          <TabsList className="bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="7d" className="rounded-md text-xs px-3 py-1" onClick={() => setActiveTimePeriod("7d")}>
              7d
            </TabsTrigger>
            <TabsTrigger
              value="30d"
              className="rounded-md text-xs px-3 py-1"
              onClick={() => setActiveTimePeriod("30d")}
            >
              30d
            </TabsTrigger>
            <TabsTrigger
              value="90d"
              className="rounded-md text-xs px-3 py-1"
              onClick={() => setActiveTimePeriod("90d")}
            >
              90d
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-48">
          {/* Responsive container for the Line Chart */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              {/* X-Axis for days */}
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  // Conditionally format tick labels to avoid crowding based on time period
                  if (activeTimePeriod === "7d") {
                    return value % 2 === 0 ? `Day ${value}` : "";
                  } else if (activeTimePeriod === "30d") {
                    return value % 5 === 0 ? `Day ${value}` : "";
                  } else {
                    return value % 15 === 0 ? `Day ${value}` : "";
                  }
                }}
              />
              {/* Y-Axis for values */}
              <YAxis
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickLine={false}
                axisLine={false}
                domain={["dataMin - 5", "dataMax + 5"]} // Adjust Y-axis domain dynamically
                tickFormatter={(value) => `$${value}`} // Format Y-axis labels as currency
              />
              {/* Tooltip for displaying data on hover */}
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Value"]} // Format tooltip value
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
                type="monotone"
                dataKey="value"
                stroke="#14B8A6" // Teal color for the line
                strokeWidth={2}
                dot={false} // No dots on the line by default
                activeDot={{ r: 6, fill: "#14B8A6", stroke: "white", strokeWidth: 2 }} // Active dot style on hover
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* ROI Card */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-500 text-xs mb-1">ROI ({activeTimePeriod})</div>
            <div className={`font-bold text-lg ${percentChange >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {percentChange >= 0 ? "+" : ""}
              {percentChange.toFixed(2)}%
            </div>
          </div>
          {/* Market Outperformance Card (mock data) */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-500 text-xs mb-1">Market Outperformance</div>
            <div className="font-bold text-lg text-emerald-600">+12.5%</div>
          </div>
          {/* Highest Value Card */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-500 text-xs mb-1">Highest Value</div>
            <div className="font-bold text-lg text-gray-800">${highestPoint.toFixed(2)}</div>
          </div>
          {/* Lowest Value Card */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-500 text-xs mb-1">Lowest Value</div>
            <div className="font-bold text-lg text-gray-800">${lowestPoint.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}