import { useEffect } from "react";
import React,{useState}from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
export default function DashboardChart() {
  const data = [{ date: "2025/01/25", totalUsers: 5, totalDoctor: 1},{ date: "2025/01/26", totalUsers: 15,totalDoctor: 5},{ date: "2025/01/28", totalUsers: 35, totalDoctor: 5},{ date: "2025/01/29", totalUsers: 10,  totalDoctor: 7},{ date: "2025/01/25", totalUsers: 8, totalDoctor: 7}];
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  
  useEffect(() => {
    const checkResize = () => {
      setWindowSize(window.innerWidth); //set the current screensize
    };

    window.addEventListener("resize", checkResize);
    return () => window.removeEventListener("resize", checkResize);
  }, []);

  //setting the width according to the screen size
  const lineChartWidth = windowSize < 768 ? 300 : 500; 
  return (
    <div>
      <div className="analysis-chart p-4 d-flex flex-column justify-content-center shadow-sm rounded ">
        <div>
          <span className="fw-medium fs-5 w-50">
            Analysis Report of registered user accounts
          </span>
        </div>
        <hr/>
        <div className="progressChart mt-4">
          <LineChart
            width={lineChartWidth}
            height={335}
            data={data}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line type="monotone" dataKey="totalUsers" stroke="#008000" />
            <Line type="monotone" dataKey="totalDoctor" stroke="#0000FF" />

            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>
      </div>
    </div>
  );
}
