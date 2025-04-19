import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const TopForumPostsChart = () => {
  const [forumData, setForumData] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/top-forums/')
      .then(res => setForumData(res.data))
      .catch(err => console.error("Error fetching top forums:", err));
  }, []);

  return (
    <div className="p-5 shadow-sm rounded bg-white">
    <h5 className="fw-medium mb-0">
      
      Forums who have most interaction
    </h5>
    <hr className="border-primary opacity-25" />
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={forumData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="title" />
          <Tooltip />
          <Legend />
          <Bar dataKey="comment_count" fill="#82ca9d" name="Comments" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopForumPostsChart;
