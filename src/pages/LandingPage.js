import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../img/logo1.png'
import landingImg from '../img/landingpage.jpg'

const LandingPage = () => {
  return (
    <>
      <div className='w-100'>

        {/* Navbar */}
        <div className='w-100'>
          <nav className="navbar bg-white w-100 px-5 shadow-sm" data-bs-theme="light">
            <div className="container-fluid">
              <a className="navbar-brand">
                <img src={logo} alt="logo" height={40} width={40} />
              </a>
              <div className="d-flex">
                <Link to={`/login`}
                  className='btn btn-outline-info px-3 me-2 rounded-pill'>
                  Login
                </Link>

                <Link to={`/register`}
                  className='btn btn-info px-3 me-2 border-dark rounded-pill'>
                  Register
                </Link>
              </div>
            </div>
          </nav>
        </div>


        {/*  Jumbotron */}
        <div className='w-100 bg-white p-5' style={{ height: 89.5 + 'vh' }}>
          <div className='container-fluid w-100 bg-white row g-2 px-lg-5'>
            <div className='col-lg-6 col-md-6 order-lg-last order-sm-last col-sm-12 col-xs-12 '>
              <img
                src={landingImg}
                className='img-fluid'
                style={{height:"auto", width:"auto"}}
                alt="img" />
            </div>
            <div class="jumbotron p-lg-5 col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <h1 class="fs-1 text-info">Project <br /> Management</h1>
              <p class="lead">
                Simplify project management with our user-friendly platform. Streamline data management, allocate resources efficiently, and foster real-time collaboration.
              </p>
              <p class="lead">
                <Link class="btn btn-info btn-lg border-dark rounded-pill shadow"
                  to={`/login`}>Get Started</Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}

export default LandingPage
