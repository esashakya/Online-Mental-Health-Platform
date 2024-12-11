import React, { Component } from 'react'

export class Home extends Component {
  render() {
    return (
      <div>
        <div className='homeImage'>
            <img src="http://localhost:8000/media/homeee.jpg" className="img-fluid"></img>
            <div className="landingText text-center ">
                <h2 className='mt-1'>Welcome to <span style={{color:'#3D52A0'}}>Untangle Chaos</span> - Your Safe Space for Mental Well-Being</h2>
                <h5>Your mental health journey is important, and we are here to listen, support, and empower you.<br/> Explore our resources, find professional help, and discover ways to live your best life with mental wellness.</h5>
            </div>
        </div>
      </div>
    )
  }
}

export default Home