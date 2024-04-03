import React from 'react'

//Import Pages
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer'

const Manager = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar/>
      
      <div className='row w-100 h-100 g-1' style={{minHeight:90+'vh'}}>
      
        {/* Sidebar */}
        <div className='sidebar border-end bg-white col-md-3 col-lg-2 p-0 offcanvas-md offcanvas-end' tabIndex={-1} id='sidebarMenu' aria-labelledby='SidebarMenuLabel'>
            <Sidebar />
        </div>

        {/* Rounters */}
        <div className='col-md-9 col-lg-10 px-4'>
              <Outlet />
        </div>

      </div> 
      {/* Footer */}
      <Footer />
    </>
  )
}

export default Manager
