import React, { useEffect, useState } from "react";
import useAxios from "../../utils/useAxios";


export default function AppointmentList() {
    const[appointmentList, setAppointmentList] = useState(null);
    const apiAxios = useAxios();
    const statusOptions = [
        { value: 1, label: "In Call", colorClass: "bg-success" },
        { value: 2, label: "Pending", colorClass: "bg-warning" },
        { value: 3, label: "Not Attended", colorClass: "bg-danger" },
      ];
  useEffect(() => {
    const fetchAppointments = async () => {
        try{
            const response = await apiAxios.get("/appointments/")
            console.log(" Res:", response.data); 
            setAppointmentList(response.data)
            console.log("error", response)
        }catch(error){
            console.log(error);
        
        }
      
    };
  
    fetchAppointments();
  }, []);
  return (
    <div>
      <table className="table table-striped table-hover mt-3">
        <thead>
          <tr>
            <th scope="col">Sn.</th>
            <th scope="col">Doctor's Name</th>
            <th scope="col">Patient's Name</th>
            <th scope="col">Appointment Date</th>
            <th scope="col">Appointment status</th>

          </tr>
        </thead>
        <tbody>
        {appointmentList && appointmentList.length > 0 ? (
            appointmentList.map((appointment, index) => (
              <tr key={appointment.id}>
                <th scope="row">{index + 1}</th>
                <td>{appointment.therapist_name}</td>
                <td>{appointment.user_fullname}</td>
                <td>{new Date(appointment.appointment_date).toLocaleString()}</td>
                <td><select
                    className="form-select"
                    defaultValue={appointment.appointment_status}
                    onChange={(e) => {
                      // Optionally, handle status change here
                      console.log("Status changed to:", e.target.value);
                    }}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No appointments 
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
