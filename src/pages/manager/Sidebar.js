import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setUserLogout } from '../../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'

const Sidebar = () => {

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const logout = () => {
    dispatch(setUserLogout())
    navigate('/')
  }

  return (
    <>
      <div class="offcanvas-header justify-content-end ">
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          data-bs-target="#sidebarMenu"
          aria-label="Close">
        </button>
      </div>
      <div class="offcanvas-body d-flex flex-column flex-shrink-0 p-3 ps-4 h-100">
        <ul class="nav nav-pills flex-column mb-auto">
          <li class="nav-item " data-bs-toggle="pill" role='pill' data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu">
            <Link to="/manager/dashboard" class="nav-link active"  >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-speedometer mb-1" viewBox="0 0 16 16">
                <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2M3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.39.39 0 0 0-.029-.518z" />
                <path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.95 11.95 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0" />
              </svg>
              &nbsp; Dashboard
            </Link>
          </li>
          <li class="nav-item" role="pill" data-bs-toggle="pill" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu">
            <Link to="/manager/reviewtasks" class="nav-link " >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clipboard2-minus mb-1" viewBox="0 0 16 16">
                <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z" />
                <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z" />
                <path d="M6 8a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z" />
              </svg>
              &nbsp; Review Tasks
            </Link>
          </li>
          <li class="nav-item" role="pill" data-bs-toggle="pill" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu">
            <Link to="/manager/showemployees" class="nav-link" >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-people-fill mb-1" viewBox="0 0 16 16">
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
              </svg>
              &nbsp; Employees
            </Link>
          </li>
          <li class="nav-item" role="pill" data-bs-toggle="pill" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu">
            <Link to="/manager/createproject" class="nav-link " >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-circle-fill mb-1" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
              </svg>
              &nbsp; Create Project
            </Link>
          </li>
        </ul>

        <hr />
        <div class="dropdown offcanvas-body ps-3">
          <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
            </svg>
          </a>
          <ul class="dropdown-menu text-small shadow" style={{}}>
            <li><a class="dropdown-item" href="#">{user.name}</a></li>
            <li className='px-2'><hr class="dropdown-divider" /></li>
            <li>
              <button
                class="dropdown-item"
                onClick={() => logout()} >
                Sign out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Sidebar
