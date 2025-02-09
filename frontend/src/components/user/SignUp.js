import React from 'react'
import {Link} from 'react-router-dom'
export default function SignUp() {
  return (
    <div>
      <div className="container">
        <div className="row form bg-light rounded-3 shadow">
          <div className = "col-md-6">
              <img src="http://localhost:8000/media/therapist.png" alt="image" className="img-fluid"></img>
          </div>
          <div className = "col-md-6 pt-4 text-center mb-3">
            <h1>Sign Up</h1>
            <form className='signUpForm'>
              <div className="input-group mb-3 pt-3">
                <input type="text" className="form-control" placeholder="Email Address" aria-label="Username"/>
              </div>
              <div className="input-group mb-3">
                <input type="password"  className="form-control" placeholder="Password" aria-describedby="passwordHelpBlock"/>
              </div> 
              <div className="input-group mb-3">
                <input type="password"  className="form-control" placeholder="Retype The Password" aria-describedby="passwordHelpBlock"/>
              </div>    
              <div class="form-text mb-2">Already have an account. <Link className='signLink' to = "/Login">Log In</Link></div>
              <button type="submit" className="btn btn-primary">Sign Up</button>      
            </form>
        </div>
        </div>
        
      </div>
    </div>
  )
}

