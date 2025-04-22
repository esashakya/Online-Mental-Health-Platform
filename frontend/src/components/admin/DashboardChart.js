import React, { useState, useEffect } from "react";
import useAxios from "../../utils/useAxios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { format, subDays } from 'date-fns';

export default function AppointmentsChart() {
  const apiAxios = useAxios();
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState(7); 
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await apiAxios.get("/appointments/");
        processChartData(response.data);
      } catch (error) {
        console.error(" appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [timeRange]);


  const processChartData = (appointments) => {
    const dateMap = new Map();
    const endDate = new Date();
    const startDate = subDays(endDate, timeRange);

 
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = format(d, 'yyyy-MM-dd');
      dateMap.set(dateKey, {
        date: format(d, 'MMM dd'),
        scheduled: 0,
        completed: 0,
        cancelled: 0
      });
    }

  
    appointments.forEach(appt => {
      const apptDate = new Date(appt.appointment_date);
      if (apptDate >= startDate && apptDate <= endDate) {
        const dateKey = format(apptDate, 'yyyy-MM-dd');
        const entry = dateMap.get(dateKey) || {
          date: format(apptDate, 'MMM dd'),
          scheduled: 0,
          completed: 0,
          NotAttended: 0
        };

        if (appt.appointment_status === 1) entry.scheduled++;
        else if (appt.appointment_status === 5) entry.completed++;
        else if (appt.appointment_status === 3) entry.NotAttended++;

        dateMap.set(dateKey, entry);
      }
    });

    setChartData(Array.from(dateMap.values()));
  };

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const statusColors = {
    scheduled: '#8884d8',
    completed: '#82ca9d',
    cancelled: '#ff8042'
  };

  return (
    <div className="analysis-chart p-2 p-md-4 shadow-sm rounded bg-white w-100">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        <h5 className="fw-medium mb-0">
         
          Appointment Trends
        </h5>
        <div className="btn-group btn-group-sm mt-2 mt-md-0">

          <button 
            className={`btn btn-outline-primary ${timeRange === 7 ? 'active' : ''}`}
            onClick={() => setTimeRange(7)}
          >
            7 Days
          </button>
          <button 
            className={`btn btn-outline-primary ${timeRange === 30 ? 'active' : ''}`}
            onClick={() => setTimeRange(30)}
          >
            30 Days
          </button>
          <button 
            className={`btn btn-outline-primary ${timeRange === 90 ? 'active' : ''}`}
            onClick={() => setTimeRange(90)}
          >
            90 Days
          </button>
        </div>
      </div>
      <hr />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer 
            width="100%" 
          
            height={windowSize < 768 ? 300 : 400}
          >
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: windowSize < 768 ? 10 : 12 }}
              />
              <YAxis 
                tick={{ fontSize: windowSize < 768 ? 10 : 12 }}
                width={windowSize < 768 ? 30 : 40}
              />
              <Tooltip 
                contentStyle={{
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconSize={windowSize < 768 ? 10 : 12}
              />
              <Line
                type="monotone"
                dataKey="scheduled"
                stroke={statusColors.scheduled}
                strokeWidth={2}
                dot={{ r: windowSize < 768 ? 3 : 4 }}
                activeDot={{ r: windowSize < 768 ? 5 : 6 }}
                name="Scheduled"
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke={statusColors.completed}
                strokeWidth={2}
                dot={{ r: windowSize < 768 ? 3 : 4 }}
                activeDot={{ r: windowSize < 768 ? 5 : 6 }}
                name="Completed"
              />
              <Line
                type="monotone"
                dataKey="cancelled"
                stroke={statusColors.cancelled}
                strokeWidth={2}
                dot={{ r: windowSize < 768 ? 3 : 4 }}
                activeDot={{ r: windowSize < 768 ? 5 : 6 }}
                name="Cancelled"
              />
            </LineChart>
          </ResponsiveContainer>

          
        </div>
      )}
    </div>
  );
}