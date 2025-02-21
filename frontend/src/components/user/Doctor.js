import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

export default function Doctor() {
  const { getRegisteredDoctors } = useContext(AuthContext);
  const [doctor, setDoctor] = useState(null); // ✅ Initialized as null

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getRegisteredDoctors();
        console.log("Fetched doctors:", response); 
        if (response) {
          setDoctor(response);
        } else {
          setDoctor([]); 
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        setDoctor([]); 
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div>
      <div className='doctorsList text-center mt-4'>
        <h1 style={{ color: '#194a7a' }}>Our Doctors</h1>
        <p className='fs-5 fst-italic'>Our doctors are there for your help. Feel free to consult with any doctor of your choice.</p>
      </div>

      <div className='container shadow-sm p-3 mb-5 bg-body-tertiary rounded'>
        <div className='row mb-5'>
          {doctor && doctor.length > 0 ? (
            
            doctor.map((doctor, index) => (
              
              <div key={index} className='col-sm-4 d-flex justify-content-center'>
                <div className="card mb-3" style={{ width: '20rem' }}>
                  <img src={doctor.doctor_photo} className="card-img-top" alt="Doctor" />
                  <div className="card-body text-center">
                    <h5 className="card-title">{doctor.user.user_fullname}</h5>
                    <p className="card-text">{doctor.user.user_email}</p>
                    <p className="card-text">Available Time: {doctor.doctor_availableTime}</p>
                    <button type="button" className="btn btn-primary" onClick={() => window.open('/PreferredDoctor', '_blank')}>
                      Know More
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No doctors available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
