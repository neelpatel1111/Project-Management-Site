import React from 'react'
import logo from '../../img/logo1.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
      <nav class="navbar navbar-expand-md bg-primary p-0" data-bs-theme="dark">
        <div class="container-fluid">
          <Link class="navbar-brand" to={'/manager/dashboard'}>
            <img src={logo} alt="logo" height={40} width={40} />
            &nbsp; <span className='fw-semibold'>Project Management</span>
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation" >

            <span class="navbar-toggler-icon"></span>
 
          </button>
        </div>
      </nav>
    </>
  )
}

export default Navbar
