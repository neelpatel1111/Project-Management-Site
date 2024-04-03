import React from 'react'
import AllProjects from './AllProjects'
import PendingProjects from './PendingProjects'
import CompletedProjects from './CompletedProjects'

const Dashboard = () => {

  return (
    <>
      <h2 className='my-3'>Projects</h2>
      <div class="container bg-white py-3 px-0 border rounded mb-3"> 

        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a class="nav-link link-primary active ms-3 px-4" data-bs-toggle="tab" aria-current="page" href="#all">All</a>
          </li>
          <li class="nav-item">
            <a class="nav-link link-danger" data-bs-toggle="tab" href="#pending">Pending</a>
          </li>
          <li class="nav-item">
            <a class="nav-link link-success" data-bs-toggle="tab" href="#completed">Completed</a>
          </li>
        </ul>

        <div class="tab-content">
          <div id="all" class="tab-pane active">
            <AllProjects />
          </div>
          <div id="pending" class="tab-pane fade">
            <PendingProjects />
          </div>
          <div id="completed" class="tab-pane fade">
            <CompletedProjects />
          </div>
        </div>
      </div>

    </>
  )
}

export default Dashboard
