import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export class Blog extends Component {
  render() {
    return (
      <div>
          <div className='topicForum text-center mt-4'>
            <h1>Blog</h1>
            <p className='fs-5 text-center'>Explore our blogs</p>
        </div>
           
        <div className='bg-light rounded p-3' style={{margin:'4%'}}>
            <div className='d-flex flex-direction-column justify-content-around'>
                <div className='col-md-6 mb-3 bg-info bg-opacity-10 border border-info-subtle rounded p-3 '>
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
                <div className='col-md-6 mb-3 bg-info bg-opacity-10 border border-info-subtle rounded p-3 '>
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
            {/* end of post 3 */}
            <div className='col-md-6 mb-3 bg-info bg-opacity-10 border border-info-subtle rounded p-3 '>
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
     
    )
  }
}

export default Blog
