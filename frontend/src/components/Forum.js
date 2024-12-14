import React, { Component } from 'react'
import {Link} from 'react-router-dom'
export class Forum extends Component {
  render() {
    return (
      <div>
        <div className='topicForum text-center mt-4'>
            <h1>Forum</h1>
            <p className='fs-5 fst-italic'>Share your thoughts and opinions.</p>
        </div>
        <div className=' m-2 d-flex justify-content-center' >
            <div className='addNew p-4 shadow p-3 mb-5' style={{width:'85%'}}>
                <div className="mb-3" >
                    <label htmlFor="exampleFormControlInput1" className="form-label fs-5 fw-light">Email the title of post</label>
                    <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Type the title"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlTextarea1" className="form-label fs-5 fw-light ">Enter your opinions/thoughts.</label>
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="5"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit the post</button>

            </div>
        </div>
    
        <div className='posts'>
            <div className='postedData col-sm-5 p-5 mb-4 shadow p-3 mb-5 '>
                <div className='dateData'>
                    <p className='fw-medium'>Date: 14/12/2024</p>
                </div>
                <div className='titlePost'>
                    <h3>Post Title</h3>
                </div>
                <div className='detailsPost'>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus blandit accumsan neque sed rutrum. Duis sodales varius lacinia. Vivamus egestas vitae libero ut vulputate. Maecenas mi sapien, cursus in lacus at, posuere ullamcorper ante. Proin felis ex, mattis nec venenatis at, tempor vel turpis. Etiam pulvinar quam quis urna consectetur laoreet. Donec luctus sem et eleifend gravida. Pellentesque pretium ante ac turpis rutrum tempus.</p>

                </div>
                <div className='viewButton'>
                    <button type="button" className="btn btn-primary"><Link to="/Post" style={{ color: 'white', textDecoration:'none' }}>View More</Link></button>
                </div>
            </div>
            {/* end of post 1 */}
            <div className='postedData col-sm-5 p-5  mb-4 shadow p-3 mb-5'>
                <div className='dateData'>
                    <p className='fw-medium'>Date: 14/12/2024</p>
                </div>
                <div className='titlePost'>
                    <h3>Post Title</h3>
                </div>
                <div className='detailsPost'>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus blandit accumsan neque sed rutrum. Duis sodales varius lacinia. Vivamus egestas vitae libero ut vulputate. Maecenas mi sapien, cursus in lacus at, posuere ullamcorper ante. Proin felis ex, mattis nec venenatis at, tempor vel turpis. Etiam pulvinar quam quis urna consectetur laoreet. Donec luctus sem et eleifend gravida. Pellentesque pretium ante ac turpis rutrum tempus.</p>

                </div>
                <div className='viewButton'>
                    <button type="button" className="btn btn-primary"><Link to="/Post" style={{ color: 'white', textDecoration:'none' }}>View More</Link></button>
                </div>
            </div>
            {/* end of 2nd post */}
            <div className='postedData col-sm-5 p-5  mb-4 shadow p-3 mb-5'>
                <div className='dateData'>
                    <p className='fw-medium'>Date: 14/12/2024</p>
                </div>
                <div className='titlePost'>
                    <h3>Post Title</h3>
                </div>
                <div className='detailsPost'>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus blandit accumsan neque sed rutrum. Duis sodales varius lacinia. Vivamus egestas vitae libero ut vulputate. Maecenas mi sapien, cursus in lacus at, posuere ullamcorper ante. Proin felis ex, mattis nec venenatis at, tempor vel turpis. Etiam pulvinar quam quis urna consectetur laoreet. Donec luctus sem et eleifend gravida. Pellentesque pretium ante ac turpis rutrum tempus.</p>

                </div>
                <div className='viewButton'>
                    <button type="button" className="btn btn-primary"><Link to="/Post" style={{ color: 'white', textDecoration:'none' }}>View More</Link></button>
                </div>
            </div>
            <div className='postedData col-sm-5 p-5  mb-4 shadow p-3 mb-5'>
                <div className='dateData'>
                    <p className='fw-medium'>Date: 14/12/2024</p>
                </div>
                <div className='titlePost'>
                    <h3>Post Title</h3>
                </div>
                <div className='detailsPost'>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus blandit accumsan neque sed rutrum. Duis sodales varius lacinia. Vivamus egestas vitae libero ut vulputate. Maecenas mi sapien, cursus in lacus at, posuere ullamcorper ante. Proin felis ex, mattis nec venenatis at, tempor vel turpis. Etiam pulvinar quam quis urna consectetur laoreet. Donec luctus sem et eleifend gravida. Pellentesque pretium ante ac turpis rutrum tempus.</p>

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

export default Forum
