import React, { Component } from 'react'

export default function Review() {
    return (
      <div >
        <div className='testimonialsTitle text-center m-5'>
          <h1 style={{color:'#194a7a'}}>Client's Review</h1>
        </div>
        <div id="carouselExampleDark" className="carousel carousel-dark slide">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
          <div className="carousel-inner">
            <div className="carousel-item active" data-bs-interval="10000">
              <div className='container '>
                <div className="card text-center shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                    <div className='imageCard mt-4'>
                      <img src="http://localhost:8000/media/user2.png"/>
                    </div>
                    <div className='card-body'>
                      <h3 className="card-title" style={{color:'#2c4875'}}>Full User Name</h3>
                      <p className="card-text fs-5 sm-fs-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium, dolor et egestas malesuada, tellus dui semper odio, vitae scelerisque elit odio quis neque. Suspendisse consequat faucibus velit. Etiam in sollicitudin ipsum. Aliquam mattis mi id augue pretium efficitur. Donec feugiat nec libero et vehicula.</p>
            
                    </div>
                </div>
              </div>
            </div>
            <div className="carousel-item" data-bs-interval="1000">
              <div className='container '>
                  <div className="card text-center shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                      <div className='imageCard mt-4'>
                        <img src="http://localhost:8000/media/user1.png"/>
                      </div>
                      <div className='card-body'>
                        <h3 className="card-title" style={{color:'#2c4875'}}>Full User Name</h3>
                        <p className="card-text fs-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium, dolor et egestas malesuada, tellus dui semper odio, vitae scelerisque elit odio quis neque. Suspendisse consequat faucibus velit. Etiam in sollicitudin ipsum. Aliquam mattis mi id augue pretium efficitur. Donec feugiat nec libero et vehicula.</p>
              
                      </div>
                  </div>
                </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    )
  }

