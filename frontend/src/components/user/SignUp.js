import React,{useState,useContext} from 'react'
import {Link} from 'react-router-dom'
import AuthContext from '../../context/AuthContext'

export default function SignUp() {
  const {registerNewUser} = useContext(AuthContext)
  const handleSubmit = async e => {
    // prevent refreshing the page
    e.preventDefault()  
    //gather the information from input tag
    const userEmail = e.target.userEmail.value  
    const userFullName = e.target.userFullName.value  
    const userPassword = e.target.userPassword.value   
    const userRetypePassword = e.target.userRetypePassword.value   

    // check if user has entered 
    userEmail.length > 0 && registerNewUser(userEmail,userFullName,userPassword,userRetypePassword)
    


  }
  return (
    <div>
      <div className="container">
        <div className="row form bg-light rounded-3 shadow">
          <div className = "col-md-6">
              <img src="http://localhost:8000/media/therapist.png" alt="image" className="img-fluid"></img>
          </div>
          <div className = "col-md-6 pt-4 text-center mb-3">
            <h1>Sign Up</h1>
            <form className='signUpForm' onSubmit={handleSubmit}>
              <div className="input-group mb-3 pt-3">
                <input type="text" className="form-control" placeholder="Email Address" name="userEmail" aria-label="Username"/>
              </div>
              <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="User Full Name" name="userFullName" aria-label="UserFullName"/>
              </div>
              <div className="input-group mb-3">
                <input type="password"  className="form-control" placeholder="Password" name="userPassword" aria-describedby="passwordHelpBlock"/>
              </div> 
              <div className="input-group mb-3">
                <input type="password"  className="form-control" placeholder="Retype The Password" name="userRetypePassword" aria-describedby="passwordHelpBlock"/>
              </div>    
              <div className="form-text mb-2">Already have an account. <Link className='signLink' to = "/Login">Log In</Link></div>
              <button type="submit" className="btn btn-primary">Sign Up</button>      
            </form>
        </div>
        </div>
        
      </div>
    </div>
  )
}

