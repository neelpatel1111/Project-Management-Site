import { React, useState, useEffect } from 'react'
import { db } from '../../firebase/firebase'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Bar } from 'react-chartjs-2'
import Swal from 'sweetalert2'

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    plugins
} from 'chart.js/auto';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    plugins
)

const ViewProject = () => {

    const { projectId } = useParams();
    const [project, setProject] = useState({})
    const [loading, setLoading] = useState(true);
    const [daysLeft, setDaysLeft] = useState();
    const [commentToAdd, setCommentToAdd] = useState('')
    const [chartData, setChartData] = useState({})
    const [workLoadData, setWorkLoadData] = useState([])
    const [chartLoading, setChartLoading] = useState(true)
    const adminUser = useSelector((state) => state.user)

    // Sweet Alert Toast
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    // Get Project Data From Firebase
    const getData = () => {
        db.collection('project').where('projectId', '==', projectId)
            .onSnapshot((snapshot) => {
                snapshot.forEach((doc) => {
                    setProject(doc.data())
                    setDaysLeft(calculateDaysLeft())
                    workPercentageTasks()
                    progressBarWidth()
                    getWorkLoadData()
                    setLoading(false)
                });
            })
    }

    // Calculate Days Left For The Project To Be Completed
    const calculateDaysLeft = () => {
        let dateNow = new Date();
        var timeDiff = Math.abs(dateNow.getTime() - new Date(project.dueDate).getTime());
        /* calculate the number of days between now and the deadline */
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    // Calculate Work Percentage for tasks
    const workPercentageTasks = () => {
        if (project.tasks) {
            let tasks = project.tasks;
            let work_percentage = 0; // work percentage

            for (let i = 0; i < tasks.length; i++) {

                let emp = tasks[i].employees;
                let counter = 0;

                for (let j = 0; j < emp.length; j++) {
                    if (emp[j].status === "Completed") {
                        counter++;
                    }
                }

                work_percentage = (counter * 100) / emp.length;
                tasks[i].workPercentage = work_percentage;
            }

            for (let k = 0; k < (project.tasks).length; k++) {
                project.tasks[k].workPercentage = tasks[k].workPercentage;
            }
        }
    }

    // Calculate Progress Bar Width ( work percentage for project )
    const progressBarWidth = () => {

        if (project.tasks) {
            let tasks = project.tasks;
            let project_percentage = 0; // work percentage
            let counter = 0;

            for (let i = 0; i < tasks.length; i++) {
                counter = counter + tasks[i].workPercentage;
            }

            project_percentage = counter / tasks.length;
            project.projectPercentage = project_percentage;
        }

    }

    // handle Add Comment
    const handleAddComment = (e) => {
        e.preventDefault()
        if (commentToAdd === '') {
            Toast.fire({
                icon: "info",
                title: `Please give a comment`
            });
        } else {
            db.collection('project').where('projectId', '==', projectId).get()
                .then((snap) => {
                    snap.docs.forEach((doc) => {
                        let comm = doc.data().comments
                        comm.push({
                            roleId: adminUser.userId,
                            name: adminUser.name,
                            role: 'manager',
                            message: commentToAdd,
                            dateTime: new Date()
                        });
                        doc.ref.update({
                            comments: comm
                        })
                    });
                    Toast.fire({
                        icon: "success",
                        title: `Comment Added Successfuly`
                    });
                    setCommentToAdd('')
                })
        }
    }

    // set WorkLoad Chart data
    const getChartData = () => {

        setChartData({
            labels: workLoadData.map(item => item.name),
            datasets: [
                {
                    label: 'Work Load',
                    data: workLoadData.map(item => item.workCount),
                    backgroundColor: '#9ec5fe'
                },
            ]
        })

    }

    // get WorkLoad Data
    const getWorkLoadData = () => {

        let employeeArray = []

        db.collection('employee').get()
            .then((employee) => {

                employee.docs.forEach((Empdoc) => {
                    let workCount = 0;  //counter for workload

                    db.collection('project').where('projectId', '==', projectId).get()
                        .then((project) => {

                            project.docs.forEach((projDoc) => {

                                projDoc.data().tasks.forEach((task) => {

                                    task.employees.forEach((emp) => {

                                        if (emp.userId === Empdoc.data().userId) {
                                            workCount++
                                        }

                                    })

                                })
                            })

                            if (workCount !== 0) {
                                employeeArray.push({ workCount: workCount, ...Empdoc.data() })
                                setWorkLoadData(employeeArray)
                            }

                        }).catch((error) => { console.log(error) });

                })

                setChartLoading(false);
                console.log(workLoadData)

            }).catch((error) => { console.log(error) });

    }

    useEffect(() => {
        getData()
    }, []);

    useEffect(() => {
        setDaysLeft(calculateDaysLeft())
        workPercentageTasks()
        progressBarWidth()
        getWorkLoadData()
    }, [project]);

    useEffect(() => {
        getChartData()
    }, [workLoadData]);

    return (
        <>
            {loading === false ? (<>
                <div className="container my-3 bg-white mx-auto border rounded">
                    <h2 className='bg-gradient mt-3 p-3 text-center bg-primary-subtle text-dark border-0 rounded'>
                        {project.title}
                        <span className='float-end pe-3'>
                            <button className='btn p-0 me-4 mb-1 border-0' data-bs-toggle="modal" data-bs-target="#addCommentModal" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-chat-square-quote-fill" viewBox="0 0 16 16">
                                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2zm7.194 2.766a1.7 1.7 0 0 0-.227-.272 1.5 1.5 0 0 0-.469-.324l-.008-.004A1.8 1.8 0 0 0 5.734 4C4.776 4 4 4.746 4 5.667c0 .92.776 1.666 1.734 1.666.343 0 .662-.095.931-.26-.137.389-.39.804-.81 1.22a.405.405 0 0 0 .011.59c.173.16.447.155.614-.01 1.334-1.329 1.37-2.758.941-3.706a2.5 2.5 0 0 0-.227-.4zM11 7.073c-.136.389-.39.804-.81 1.22a.405.405 0 0 0 .012.59c.172.16.446.155.613-.01 1.334-1.329 1.37-2.758.942-3.706a2.5 2.5 0 0 0-.228-.4 1.7 1.7 0 0 0-.227-.273 1.5 1.5 0 0 0-.469-.324l-.008-.004A1.8 1.8 0 0 0 10.07 4c-.957 0-1.734.746-1.734 1.667 0 .92.777 1.666 1.734 1.666.343 0 .662-.095.931-.26z" />
                                </svg>
                            </button>
                            <Link
                                to={`/manager/manageproject/${projectId}`}
                                className='link-dark'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-gear-wide-connected mb-1" viewBox="0 0 16 16">
                                    <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z" />
                                </svg>
                            </Link>
                        </span>
                    </h2>

                    {/* Row 1 */}
                    <div className='row g-2'>
                        <div className="col-lg-8 col-md-8 ">
                            <div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow={parseFloat(project.projectPercentage).toFixed(1)} aria-valuemin="0" aria-valuemax="100">
                                <div class="progress-bar bg-success" style={{ width: parseFloat(project.projectPercentage).toFixed(1) + '%' }}>{parseFloat(project.projectPercentage).toFixed(1)}%</div>
                            </div>
                            <div className="row g-2 mt-1">
                                {project.tasks.map((task) => (<>
                                    <div className='col-lg-3 col-md-4 col-sm-4 col-xs-4'>
                                        <div className="card text-center h-100">
                                            <div className="card-header bg-white ">
                                                {task.title}
                                            </div>
                                            <div className="card-body">
                                                {task.workPercentage === 100 ? (<>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                    </svg>
                                                    <br />
                                                    <span>Completed</span>
                                                </>) : (<>
                                                    <span className='badge text-bg-warning fs-5 rounded-pill'>
                                                        {parseFloat(task.workPercentage).toFixed(1)}%
                                                    </span>
                                                    <br />
                                                    <span>In Process</span>
                                                </>)}

                                            </div>
                                        </div>
                                    </div>
                                </>))}
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 ">
                            <div className='h-100 bg-light py-3 text-center fs-3 rounded'>
                                <div>
                                    <span className='badge fs-6 text-bg-success'>Due Date</span> <br /> {(project.dueDate).toLocaleString('en-IN')}
                                </div>

                                {(new Date(project.dueDate).getTime() - (new Date()).getTime()) < 0 ? (<>
                                    <div>
                                        <span className='badge text-bg-danger'> {daysLeft} days late </span>
                                    </div>
                                </>) : (<>
                                    <div>
                                        <span className='badge text-bg-info '> {daysLeft} days left </span>
                                    </div>
                                </>)}

                            </div>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className='row g-2 mt-0 mb-2'>
                        <div className="col-lg-6">
                            <div className="h-100 p-3 bg-light rounded">

                                <h5 className='text-center mb-3'>Tasks</h5>

                                <div className="card p-2 border overflow-auto">
                                    <table className="table table-hover table-responsive align-middle">
                                        <thead className="table-head">
                                            <tr>
                                                <th>Task</th>
                                                <th>Description</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className='table-body'>
                                            {project.tasks.map((task) => (<>
                                                <tr>
                                                    <td>{task.title}</td>
                                                    <td>{task.description}</td>
                                                    <td>
                                                        {task.workPercentage === 100 ? (<>
                                                            <span className='badge bg-success w-100'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                                                </svg>
                                                            </span>
                                                        </>) : (<>
                                                            <span className='badge text-bg-warning fs-6'>
                                                                {parseFloat(task.workPercentage).toFixed(1)}%
                                                            </span>
                                                        </>)}
                                                    </td>
                                                </tr>
                                            </>))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="h-100 p-3 bg-light rounded">
                                <h5 className='text-center mb-3'>Employees</h5>
                                <div className="card p-2 border overflow-auto">
                                    <table className="table table-hover table-responsive align-middle">
                                        <thead className="table-head">
                                            <tr>
                                                <th>Task</th>
                                                <th>Empoyees</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className='table-body'>
                                            {project.tasks.map((task) => (<>
                                                <tr>
                                                    <td>{task.title}</td>
                                                    <td>
                                                        {task.employees.map((emp) => (<>
                                                            <tr>
                                                                <td>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill mb-1" viewBox="0 0 16 16">
                                                                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                                                    </svg> {emp.name}
                                                                </td>
                                                            </tr>
                                                        </>))}
                                                    </td>
                                                    <td>
                                                        {task.employees.map((emp) => (<>
                                                            <tr>
                                                                <td>
                                                                    {emp.status === 'Completed' ? (<>
                                                                        <span className='badge text-bg-success'>{emp.status}</span>
                                                                    </>) : (<>
                                                                        {emp.status === 'In Review' ? (<>
                                                                            <span className='badge text-bg-primary'>{emp.status}</span>
                                                                        </>) : (<>
                                                                            <span className='badge text-bg-danger'>{emp.status}</span>
                                                                        </>)}
                                                                        
                                                                    </>)}
                                                                </td>
                                                            </tr>
                                                        </>))}
                                                    </td>
                                                </tr>
                                            </>))}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className='row g-2 mb-2'>
                        <div className="col-lg-6">
                            <div className="h-100 p-3 bg-light rounded">

                                <h5 className='text-center mb-3'>Comments</h5>

                                <div className="card p-2 border overflow-auto" style={{ maxHeight: "50vh" }}>
                                    {project.comments.map((comment) => (
                                        <>
                                            {comment.role === 'manager' ? (<>
                                                <div className='w-100 mb-1'>
                                                    <span className='px-2 py-1 border-end border-3 border-warning bg-warning-subtle  rounded float-end'>
                                                        {comment.message} <br />
                                                        <small class="text-muted float-end">{((comment.dateTime).toDate().toLocaleString('en-IN'))}</small>
                                                    </span>
                                                </div>

                                            </>) : (<>
                                                <div className='w-100 mb-1 '>
                                                    <span className='px-2 py-1 border-start border-3 border-primary bg-primary-subtle rounded float-start'>
                                                        <span className='text-primary fw-bold'>{comment.name}</span> <br />
                                                        {comment.message} <br />
                                                        <small className='text-muted float-end'>{((comment.dateTime).toDate().toLocaleString('en-IN'))}</small>
                                                    </span>
                                                </div>
                                            </>)}
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Work Load */}
                        <div className="col-lg-6">
                            <div className="h-100 p-3 bg-light rounded">
                                <h5 className='text-center mb-3'>Work Load</h5>
                                <div className="card p-2 border">
                                    {chartLoading === false ? (<>
                                        <Bar
                                            options={{
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        display: false
                                                    }
                                                },
                                                scales: {
                                                    x: {
                                                        grid: {
                                                            display: false
                                                        }
                                                    },
                                                    y: {
                                                        grid: {
                                                            display: false
                                                        }
                                                    }
                                                }
                                            }}
                                            data={chartData}
                                        />
                                    </>) : (<>
                                        Loading...
                                    </>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  Modal for adding comment */}
                <div class="modal fade" id="addCommentModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Comment</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleAddComment}>
                                <div class="modal-body">

                                    <div class="mb-3">
                                        <label for="comment-text" class="col-form-label">Give your comment:</label>
                                        <textarea
                                            onChange={(e) => setCommentToAdd(e.target.value)}
                                            class="form-control"
                                            id="comment-text"
                                            rows={5}
                                            value={commentToAdd}
                                            required>
                                        </textarea>
                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" class="btn btn-primary bg-gradient" data-bs-dismiss="modal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill mb-1" viewBox="0 0 16 16">
                                            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                                        </svg>
                                        &nbsp;Send
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </>) : (<>
                Loading
            </>)}

        </>
    )
}

export default ViewProject
