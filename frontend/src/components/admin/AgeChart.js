import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';

const AgeChart = () => {
  const [doctorStatusData, setDoctorStatusData] = useState([]);
  const COLORS = {
    "Working": "#4CAF50",  
    "On Leave": "#FF5722"  
  };
  useEffect(() => {
    axios.get(' http://127.0.0.1:8000/api/doctor-status-summary/')
      .then(response => setDoctorStatusData(response.data))
      .catch(error => console.error("Error fetching doctor status:", error));
  }, []);

  return (
    <div className="p-5 shadow-sm rounded bg-white">
       <h5 className="fw-medium mb-0">
         
         Doctor Status for today
       </h5>
       <hr className="border-primary opacity-25" />

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={doctorStatusData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value">
            {doctorStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#8884d8"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgeChart;
