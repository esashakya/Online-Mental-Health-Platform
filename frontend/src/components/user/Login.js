import React, { useContext } from 'react'
import {Link} from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
export default function Login() {
  const {loginRegisteredUser} = useContext(AuthContext)
  const handleSubmit = e => {
    // prevent refreshing the page
    e.preventDefault()  
    //gather the information from input tag
    const userEmail = e.target.userEmail.value  
    const userPassword = e.target.userPassword.value   
    // check if user has entered 
    userEmail.length > 0 && loginRegisteredUser(userEmail,userPassword)
    


  }
  return (
    <div>
      <div className="container">
        <div className="row form bg-light rounded-3 shadow">
          <div className = "col-md-6">
              <img src="http://localhost:8000/media/login.png" alt="image" className="img-fluid"></img>
          </div>
          <div className = "col-md-6 pt-4 text-center mb-3">
            <h1 className='text-info-emphasis'>LOG IN</h1>
            <h5 className= 'pt-2'>Welcome Back! It's good to see you again.</h5>
            <form className='signUpForm' onSubmit={handleSubmit}>
              <div className="input-group mb-3 pt-4">
                <input type="text" className="form-control" name="userEmail" placeholder="Email Address" aria-label="Username"/>
              </div>
              <div className="input-group mb-3">
                <input type="password"  className="form-control" name="userPassword" placeholder="Password" aria-describedby="passwordHelpBlock"/>
              </div>  
              <div className="form-text mb-2">Don't have an account. <Link className='signLink' to = "/SignUp">Sign Up</Link></div>
              <button type="submit" className="btn btn-primary">LOG IN</button>     
               
            </form>
        </div>
        </div>
        
      </div>
    </div>
  )
}