import React, { useEffect, useState } from 'react';
import useAxios from '../../utils/useAxios';

export default function Calculation({ detail }) {
  const apiAxios = useAxios();
  const [boxNumbers, setBoxNumbers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (detail === "Doctors") {
          const res = await apiAxios.get('/doctors/');
          setBoxNumbers(res.data.count || res.data.length);  
        } else if (detail === "Users") {
        
          const res = await apiAxios.get('/users/');
          setBoxNumbers(res.data.count || res.data.length);
        } else if (detail === "Appointments") {
            const res = await apiAxios.get('/appointments/count/');
            setBoxNumbers(res.data.count);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchData();
  }, [detail]);

  return (
    <div className="col-12 col-md-3">
      <div className="box d-flex flex-wrap p-4 text-center">
        <span className="title fs-4">{detail}:</span>
        <div className="d-flex flex-column view">
          <span className="numbers fs-4">{boxNumbers}</span>
          
        </div>
      </div>
    </div>
  );
}
