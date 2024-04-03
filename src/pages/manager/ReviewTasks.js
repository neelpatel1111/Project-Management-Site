import React, { useState, useEffect } from 'react'
import { db } from '../../firebase/firebase'
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

const ReviewTasks = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.user)

    // complete task function
    const markCompleted = (projectId, taskId, employeeId) => {

        Swal.fire({
            title: "Are you sure to complete this task ?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            width: 450
        }).then((result) => {
            if (result.isConfirmed) {

                db.collection("project").where('projectId', "==", projectId).get()
                    .then(projects => {

                        projects.forEach((project) => {

                            let newTasks = project.data().tasks

                            for (let i = 0; i < newTasks.length; i++) {
                                if (newTasks[i].taskId === taskId) {

                                    for (let j = 0; j < (newTasks[i].employees).length; j++) {

                                        if ((newTasks[i].employees[j]).userId === employeeId) {
                                            (newTasks[i].employees[j]).status = 'Completed'
                                        }

                                    }
                                }
                            }

                            project.ref.update({
                                tasks: newTasks
                            }).then(() => {
                                Swal.fire({
                                    title: "Task Completed!",
                                    icon: "success",
                                    width: 450
                                });
                            })
                        })

                    })

            }
        });

    }
    // complete task function
    const markInProcess = (projectId, taskId, employeeId) => {

        Swal.fire({
            title: "Are you sure to mark In Process?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            width: 450
        }).then((result) => {
            if (result.isConfirmed) {

                db.collection("project").where('projectId', "==", projectId).get()
                    .then(projects => {

                        projects.forEach((project) => {

                            let newTasks = project.data().tasks

                            for (let i = 0; i < newTasks.length; i++) {
                                if (newTasks[i].taskId === taskId) {

                                    for (let j = 0; j < (newTasks[i].employees).length; j++) {

                                        if ((newTasks[i].employees[j]).userId === employeeId) {
                                            (newTasks[i].employees[j]).status = 'In Process'
                                        }

                                    }
                                }
                            }

                            project.ref.update({
                                tasks: newTasks
                            }).then(() => {
                                Swal.fire({
                                    title: "Task marked as In Process!",
                                    icon: "success",
                                    width: 450
                                });
                            })
                        })

                    })

            }
        });

    }
    useEffect(() => {
        db.collection('project').onSnapshot((snapshot) => {
            let tempArray = []
            snapshot.docs.forEach((doc) => {
                let isSelected = false;
                doc.data().tasks.forEach((task) => {
                    task.employees.forEach(employee => {
                        if (employee.status === 'In Review') {
                            if (isSelected === false) {
                                tempArray.push({ ...doc.data(), id: doc.id })
                                isSelected = true
                            }
                        }

                    })
                });
            })
            setProjects(tempArray);
            setLoading(false);
        });

    }, [])

    return (
        <div className="container my-4">
            <h3 className='mb-4'>Review Tasks</h3>
            {loading === false ? (<>
                <div className='row'>
                    {projects.map((item, index) => (<>
                        <div className='col-12'>
                            <div className='card mb-3 shadow-sm'>
                                <h4 className='card-header'>{item.title}</h4>
                                <div className='card-body overflow-auto'>
                                    <table className='table table-hover table-responsive align-middle'>
                                        <thead className='table-head'>
                                            <tr>
                                                <th>Title</th>
                                                <th>Employee</th>
                                                <th>Description</th>
                                                <th>Status</th>
                                                <th>Attachments</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className='table-body'>
                                            {item.tasks.map((task) => (<>
                                                {task.employees.map(emp => (<>
                                                    {emp.status === 'In Review' ? (<>
                                                        <tr>
                                                            <td>{task.title}</td>
                                                            <td>{emp.name}</td>
                                                            <td>{task.description}</td>
                                                            <td><i>{emp.status}</i></td>
                                                            <td>
                                                                <a 
                                                                className='btn btn-sm btn-secondary'
                                                                href={emp.fileURL} 
                                                                target='_blank'>
                                                                    View
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <div className='d-flex'>
                                                                    <button 
                                                                        className='btn btn-sm btn-danger me-1'
                                                                        onClick={() => { markInProcess(item.projectId, task.taskId, emp.userId) }}
                                                                    >
                                                                        In Process
                                                                    </button>
                                                                    <button
                                                                        className='btn btn-sm btn-success'
                                                                        onClick={() => { markCompleted(item.projectId, task.taskId, emp.userId) }}
                                                                    >
                                                                        Completed
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </>) : (<></>)}
                                                </>))}
                                            </>))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>))}
                </div>
            </>) : (<>
                Loading...
            </>)}

        </div>
    )
}

export default ReviewTasks
