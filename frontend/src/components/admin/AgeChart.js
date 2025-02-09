import React from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";
export default function AgeChart() {
  const data = [
    {
      name: "18-20 Age",
      totalNoAge: 5,
      fill: "#8884d8",
    },
    {
      name: "21-25 Age",
      totalNoAge: 7,
      fill: "#83a6ed",
    },
    {
      name: "26-30 Age",
      totalNoAge: 10,
      fill: "#8dd1e1",
    },
    {
      name: "30-35",
      totalNoAge: 11,
      fill: "#82ca9d",
    },
    {
      name: "40 Age",
      totalNoAge: 1,
      fill: "#a4de6c",
    },
  ];

  return (
    <div>
      <div className="analysis-chart p-4 d-flex flex-column justify-content-center shadow-sm rounded p-2 ">
        <div>
          <span className="fw-medium fs-5">Analysis Report of User's age</span>
        </div>
        <hr/>
        <div className="d-flex align-items-center">
          <RadialBarChart
            width={420}
            height={360}
            innerRadius="10%"
            outerRadius="90%"
            data={data}
            startAngle={180}
            endAngle={-180}
          >
            <RadialBar
              minAngle={15}
              label={{ fill: "#000000", position: "insideStart",fontSize: 12 }}
              background
              clockWise={true}
              dataKey="totalNoAge"
            />
            
            <Legend
              iconSize={10}

              layout="vertical"
              verticalAlign="bottom"
              align="right"
            />
            <Tooltip />
          </RadialBarChart>
        </div>
      </div>
    </div>
  );
}
