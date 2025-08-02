import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0d6efd", "#198754", "#ffc107"];

function NutritionChart({ nutrition }) {
  if (!nutrition) return null;
  const data = [
    { name: "Calories", value: nutrition.calories || 0 },
    { name: "Protein", value: nutrition.protein || 0 },
    { name: "Sugar", value: nutrition.sugar || 0 },
  ];

  return (
    <div className="mb-4 text-center">
      <h4>Nutrition Breakdown</h4>
      <PieChart width={300} height={250}>
        <Pie
          data={data}
          cx={150}
          cy={100}
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default NutritionChart;
