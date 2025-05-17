"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Mock data for the performance chart
const generateData = () => {
  const data = []
  let value = 100

  for (let i = 0; i < 30; i++) {
    // Random daily change between -3% and +5%
    const change = (Math.random() * 8 - 3) / 100
    value = value * (1 + change)

    data.push({
      day: i + 1,
      value: value.toFixed(2),
    })
  }

  return data
}

export function PerformanceChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    setData(generateData())
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Day ${value}`}
          tick={{ fontSize: 12, fill: "#6B7280" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          tick={{ fontSize: 12, fill: "#6B7280" }}
        />
        <Tooltip
          formatter={(value) => [`$${value}`, "Value"]}
          labelFormatter={(label) => `Day ${label}`}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            border: "1px solid #E5E7EB",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#14B8A6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: "#14B8A6", stroke: "white", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
