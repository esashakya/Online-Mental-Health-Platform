import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export class Blog extends Component {
  render() {
    return (
      <div>
        <div className='container'>
          <div className="text-center">
            <h1 className="fw-bold pt-3">Blog</h1>
            <p className="fs-5 text-muted">Discover articles written by our doctors</p>
        </div>
         <div className="row g-4 bg-white mt-5 px-3">
                
            <div  className="col-md-6 mb-4 blogContent d-flex flex-column">
                <div className='blogPicture pt-2'>
                    <img src="http://localhost:8000/media/anxiety.png" alt="Blog Img"></img>
                    <div className='blogCredit text-start w-100'>
                        <p >Dr. Eva Maharjan || Therapist</p>
                        
                        <p>Over <span className='text-success'>3+ years</span> experience</p>
                    </div>
                </div>
                <div className=" blogPost  p-2 h-100">
                        
                    <h3 className="text-center">Blog Title</h3>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <p className="text-body-secondary">Date: 2/3/2025</p>
                        <span className="badge rounded-pill text-bg-info fw-lighter">OCD</span>
                    </div>
                        
                    <p className="text-dark">lorem ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum pharetra nunc non diam lacinia, id viverra magna porttitor. Donec nulla turpis, finibus sit amet diam laoreet, bibendum ultricies dui.</p>
                    <div className="text-start ">
                        <Link to="/Post" className='text-decoration-none'>
                                Read More 
                        </Link>
                    </div>
                </div>
                
            </div>
            <div  className=" col-md-6 mb-4 blogContent d-flex flex-column">
                <div className='blogPicture pt-2'>
                    <img src="http://localhost:8000/media/depression.png" alt="Blog Img"></img>
                    <div className='blogCredit text-start w-100'>
                        <p >Dr. Rajesh Maharjan || Therapist</p>
                        
                        <p>Over <span className='text-success'>15+ years</span> experience</p>
                    </div>
                </div>
                <div className=" blogPost  p-3 h-50">
                        
                    <h3 className="text-center">Blog Title</h3>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <p className="text-body-secondary">Date: 2/3/2025</p>
                        <span className="badge rounded-pill text-bg-info fw-lighter">OCD</span>
                    </div>
                        
                    <p className="text-dark">lorem ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum pharetra nunc non diam lacinia, id viverra magna porttitor. Donec nulla turpis, finibus sit amet diam laoreet, bibendum ultricies dui.</p>
                    <div className="text-start ">
                        <Link to="/Post" className='text-decoration-none'>
                                Read More 
                        </Link>
                    </div>
                </div>
                
            </div>
            <div  className=" col-md-6 mb-4 blogContent d-flex flex-column">
                <div className='blogPicture pt-2'>
                    <img src="http://localhost:8000/media/depression.png" alt="Blog Img"></img>
                    <div className='blogCredit text-start w-100'>
                        <p >Dr. Rajesh Maharjan || Therapist</p>
                        
                        <p>Over <span className='text-success'>15+ years</span> experience</p>
                    </div>
                </div>
                <div className=" blogPost  p-3 h-50">
                        
                    <h3 className="text-center">Blog Title</h3>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <p className="text-body-secondary">Date: 2/3/2025</p>
                        <span className="badge rounded-pill text-bg-info fw-lighter">OCD</span>
                    </div>
                        
                    <p className="text-dark">lorem ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum pharetra nunc non diam lacinia, id viverra magna porttitor. Donec nulla turpis, finibus sit amet diam laoreet, bibendum ultricies dui.</p>
                    <div className="text-start ">
                        <Link to="/Post" className='text-decoration-none'>
                                Read More 
                        </Link>
                    </div>
                </div>
                
            </div>  
            </div>
            </div>
        </div>
     
    )
  }
}

export default Blog
