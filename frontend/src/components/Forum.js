import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Typewriter from 'typewriter-effect';

export default function Forum(){
    return (
      <div>
        <div className='topicForum text-center mt-4'>
            <h1>Forum</h1>
            <p className='fs-5 text-center'>
            <Typewriter options={{
                    autoStart:true,
                    loop:true,
                    delay:50, 
                    deleteSpeed:100,
                    strings:["A mental health forum is a safe haven—a place where voices are heard, struggles are shared,and healing begins through connection and understanding"]
                }}/> 
            </p>
        </div>

        <div className='bg-light rounded p-3' style={{margin:'5%'}}>
            <div className='newPost'>
                <div className='postedData   p-3 '  data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    <div className='row mb-3 align-items-center'>
                        <div className='titlePost col-md-9'>
                            <h5 className='fw-medium'>Add a new post</h5>
                        </div>
                        <div className='dateData col-md-2'>
                            <button type="button" className='btn btn-primary'  data-bs-toggle="modal" data-bs-target="#staticBackdrop" style={{fontSize:"1.2rem",display: "flex",alignItems: "center",
                        justifyContent: "center",backgroundColor:"#007AF5",marginLeft:"99%"}}>+</button>
                        </div>
                        
                    </div> 
                    
                </div>
            </div>
            <div className='posts'>
                <div className='postedData   p-3 '>
                    <div className='row mb-3'>
                        <div className='titlePost col-md-9'>
                            <h2>Post Title</h2>
                        </div>
                        <div className='dateData col-md-3'>
                            <h5 className='fw-medium'>Date: 14/12/2024</h5>
                        </div>
                        
                    </div>
                    
                    <div className='detailsPost'>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus blandit accumsan neque sed rutrum. Duis sodales varius lacinia. Vivamus egestas vitae libero ut vulputate. Maecenas mi sapien, cursus in lacus at, posuere ullamcorper ante. Proin felis ex, mattis nec venenatis at, tempor vel turpis. Etiam pulvinar quam quis urna consectetur laoreet. Donec luctus sem et eleifend gravida. Pellentesque pretium ante ac turpis rutrum tempus.</p>

                    </div>
                    <div className='viewButton'>
                        <button type="button" className="btn btn-primary"><Link to="/Post" style={{ color: 'white', textDecoration:'none' }}>View More</Link></button>
                    </div>
                </div>
                {/* end of post 1 */}
                <div className='postedData p-3 '>
                    <div className='row mb-3'>
                        <div className='titlePost col-md-9'>
                            <h2>Post Title</h2>
                        </div>
                        <div className='dateData col-md-3'>
                            <h5 className='fw-medium'>Date: 14/12/2024</h5>
                        </div>
                        
                    </div>
                    
                    <div className='detailsPost'>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus blandit accumsan neque sed rutrum. Duis sodales varius lacinia. Vivamus egestas vitae libero ut vulputate. Maecenas mi sapien, cursus in lacus at, posuere ullamcorper ante. Proin felis ex, mattis nec venenatis at, tempor vel turpis. Etiam pulvinar quam quis urna consectetur laoreet. Donec luctus sem et eleifend gravida. Pellentesque pretium ante ac turpis rutrum tempus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus blandit accumsan neque sed rutrum.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus blandit accumsan neque sed rutrum.</p>

                    </div>
                    <div className='viewButton'>
                        <button type="button" className="btn btn-primary"><Link to="/Post" style={{ color: 'white', textDecoration:'none' }}>View More</Link></button>
                    </div>
                </div>
                
            </div>
        </div>
        {/* <!-- Modal --> */}
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content" style={{backgroundColor: "#e3f2fd"}}>
            <div class="modal-header " style={{backgroundColor: "#bbdefb"}}>
                <h1 class="modal-title fs-5" id="exampleModalLabel" style={{color: "#0d47a1"}}>Fill the contents below</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="title" class="form-label">Enter your forum title:</label>
                        <input type="text" class="form-control" aria-required="true"/>
                        
                    </div>
                    <div class="mb-3">
                        <label for="title" class="form-label">Enter your post/opinions/thoughts:</label><br/>
                        <textarea name="newPostContent" class="form-control" rows="5" aria-required="true"></textarea>
                        
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Post</button>
            </div>
            </div>
        </div>
        </div>
      </div>
      
    )
  }

