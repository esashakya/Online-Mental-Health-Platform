import React from 'react'

export default function AdminPanel() {
  return (
    <div>
      <div className='d-flex flex-column p-5 bg-admin text-light w-100 fw-lighter admin-nav' style={{height:"100%"}}>
        <div className='d-flex flex-column justify-content-center align-items-center mb-4'>
        <div className='adminProfile mb-2'>
          <img src="http://localhost:8000/media/admin.png" alt="Admin Profile"/>
        </div>
        <span>UntangleChaos</span>
        <hr/>
        </div>
        
        <div className='mb-4'>
          <ul>
            <li>
              Registered Doctor Accounts
            </li>
            <li>
              Registered User Accounts
            </li>
            <li>
              Appointments
            </li>
            <li>
              Admin Profile
            </li>
          </ul>
        </div>
        
        
      </div>
    </div>
  )
}
