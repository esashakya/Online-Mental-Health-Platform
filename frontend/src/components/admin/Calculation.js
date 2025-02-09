import React from 'react'

export default function Calculation({detail}) {
    let value;
    if (detail=="Doctors"){
        value={
            boxTitle:"Doctors",
            boxNumbers: 20,
        }
    }else if(detail=="Users"){
        value={
            boxTitle:"Users",
            boxNumbers: 20,
        }
    }else{
        value={
            boxTitle:"Appointments",
            boxNumbers: 50,
        }
    }
  return (
    <>
    <div className=' col-12 col-md-3'>
      
        <div className='box d-flex flex-row p-4 text-center '>
            <span className='title fs-4'>{value.boxTitle}</span>
            <div className='d-flex flex-column view'>
            <span className='numbers fs-4'>{value.boxNumbers}</span>
            <span className='numbers fs-6 text-primary'>View More</span>
            </div>
            
        </div>
       
      
    </div>
    </>
  )
}
