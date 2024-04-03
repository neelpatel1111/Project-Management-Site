import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Import Pages
import LandingPage from '../pages/LandingPage'
import Login from '../pages/Login'
import Register from '../pages/Register'
import NotAuth from '../pages/NotAuth'

// Manager 
import Manager from '../pages/manager/Manager'
import ManagerDashboard from '../pages/manager/Dashboard'
import CreateProject from '../pages/manager/CreateProject'
import ShowEmployees from '../pages/manager/ShowEmployees'
import AddTask from '../pages/manager/AddTask'
import ViewProject from '../pages/manager/ViewProject'
import EditTask from '../pages/manager/EditTask'
import ManageProject from '../pages/manager/ManageProject'
import ReviewTasks from '../pages/manager/ReviewTasks'

//Employee
import Employee from '../pages/employee/Employee'
import MyProjects from '../pages/employee/MyProjects'
import ViewProjectEmployee from '../pages/employee/ViewProjectEmployee'
import PendingTask from '../pages/employee/PendingTask'
import CompletedTask from '../pages/employee/CompletedTask'
import ReviewTask from '../pages/employee/ReviewTask'


const Routers = () => {

  const isLoggedIn = useSelector(state => state.isLoggedIn)
  const user = useSelector(state => state.user)

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Manager Routes */}
        {isLoggedIn === true ? (<>
          {user.role === 'manager' ? (
          <Route path="/manager" element={<Manager />}>
            <Route path='' element={<ManagerDashboard />} />
            <Route path='dashboard' element={<ManagerDashboard />} />
            <Route path='showemployees' element={<ShowEmployees />} />
            <Route path='reviewtasks' element={<ReviewTasks/>} />
            <Route path='createproject' element={<CreateProject />} />
            <Route path=':projectId/addtask' element={<AddTask />} />
            <Route path=':projectId/edittask/:taskId' element={<EditTask />} />
            <Route path='viewproject/:projectId' element={<ViewProject />} />
            <Route path='manageproject/:projectId' element={<ManageProject />} />
          </Route>
        ) : (<><Route path='*' element={<NotAuth />}/></>)}

        </>) : (<>
          <Route path='*' element={<Login />}/>
        </>)}


        {/* Employee Routes */}
        {isLoggedIn === true ? (<>
          {user.role === 'employee' ? (
            <Route path="/employee" element={<Employee />}>
              <Route path='' element={<MyProjects />}/>
              <Route path='myprojects' element={<MyProjects />}/>
              <Route path='viewproject/:projectId' element={<ViewProjectEmployee />}/>
              <Route path='pendingtasks' element={<PendingTask />} />
              <Route path='reviewtasks' element={<ReviewTask />} />
              <Route path='completedtasks' element={<CompletedTask />} />
            </Route>
        ) : (<><Route path='*' element={<NotAuth />}/></>)}

        </>) : (<>
          <Route path='*' element={<Login />}/>
        </>)}

      </Routes>
    </>
  )
}

export default Routers
