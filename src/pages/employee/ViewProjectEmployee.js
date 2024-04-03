import { React, useState, useEffect } from 'react'
import { db } from '../../firebase/firebase'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

const ViewProjectEmployee = () => {

    const { projectId } = useParams();
    const [project, setProject] = useState({})
    const [loading, setLoading] = useState(true);
    const [daysLeft, setDaysLeft] = useState();
    const [commentToAdd, setCommentToAdd] = useState('')
    const [workLoadData, setWorkLoadData] = useState([])
    const user = useSelector((state) => state.user)

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
                            roleId: user.userId,
                            name: user.name,
                            role: 'employee',
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

    return (
        <>
            {loading === false ? (<>
                <div className="container my-3 bg-white mx-auto border rounded">
                    <h2 className='bg-gradient mt-3 p-3 text-center bg-primary-subtle text-dark border-0 rounded'>
                        {project.title}
                        <span className='float-end pe-1'>
                            <button className='btn p-0 me-4 mb-1 border-0' data-bs-toggle="modal" data-bs-target="#addCommentModal" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-chat-square-quote-fill" viewBox="0 0 16 16">
                                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2zm7.194 2.766a1.7 1.7 0 0 0-.227-.272 1.5 1.5 0 0 0-.469-.324l-.008-.004A1.8 1.8 0 0 0 5.734 4C4.776 4 4 4.746 4 5.667c0 .92.776 1.666 1.734 1.666.343 0 .662-.095.931-.26-.137.389-.39.804-.81 1.22a.405.405 0 0 0 .011.59c.173.16.447.155.614-.01 1.334-1.329 1.37-2.758.941-3.706a2.5 2.5 0 0 0-.227-.4zM11 7.073c-.136.389-.39.804-.81 1.22a.405.405 0 0 0 .012.59c.172.16.446.155.613-.01 1.334-1.329 1.37-2.758.942-3.706a2.5 2.5 0 0 0-.228-.4 1.7 1.7 0 0 0-.227-.273 1.5 1.5 0 0 0-.469-.324l-.008-.004A1.8 1.8 0 0 0 10.07 4c-.957 0-1.734.746-1.734 1.667 0 .92.777 1.666 1.734 1.666.343 0 .662-.095.931-.26z" />
                                </svg>
                            </button>
                        </span>
                    </h2>

                    {/* Row 1 */}
                    <div className='row g-2'>
                        <div className="col-lg-3 col-md-3 ">
                            <div className='h-100 w-100 p-3 bg-light rounded'>
                                <h5>
                                    <div className='mb-2'>
                                        Status: {project.projectPercentage < 100 ? (<span className='text-warning'>In Progress</span>) : (<span className='text-success'>Completed</span>)}
                                    </div>
                                    <div>
                                        Progress: <span className='badge text-bg-info fs-5 rounded-pill'>
                                            {parseFloat(project.projectPercentage).toFixed(1)}%
                                        </span>
                                    </div>
                                </h5>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6 ">
                            <div className='h-100 w-100 p-3 bg-light rounded'>
                                <h4> About Project </h4>
                                <p> {project.description} </p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 ">
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
                        <div className="col-lg-12">
                            <div className="h-100 p-3 bg-light rounded">

                                <h5 className='text-center mb-3'>Tasks Assigned</h5>

                                <div className="card p-2 border overflow-auto">
                                    <table className="table table-hover table-responsive align-middle">
                                        <thead className="table-head">
                                            <tr>
                                                <th>Task</th>
                                                <th>Status</th>
                                                <th>Description</th>
                                                <th>Employees</th>
                                                <th>Employee Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className='table-body'>
                                            {project.tasks.map((task) => (<>
                                                {task.employees.filter(emp => emp.userId === user.userId).map((emp) => (<>
                                                    <tr>
                                                        <td>{task.title}</td>
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
                                                        <td>{task.description}</td>
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
                                            </>))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Row 3 */}
                    <div className='row g-2 mb-2'>
                        <div className="col-lg-12">
                            <div className="h-100 p-3 bg-light rounded">

                                <h5 className='text-center mb-3'>Comments</h5>

                                <div className="card p-2 border overflow-auto" style={{ maxHeight: "50vh" }}>
                                    {project.comments.map((comment) => (
                                        <>
                                            {comment.roleId === user.userId ? (<>
                                                <div className='w-100 mb-1'>
                                                    <span
                                                        className='px-2 py-1 border-end border-3 border-warning bg-warning-subtle rounded float-end'
                                                        style={{ maxWidth: 75 + '%' }}>
                                                        {comment.message} <br />
                                                        <small class="text-muted float-end">{((comment.dateTime).toDate().toLocaleString('en-IN'))}</small>
                                                    </span>
                                                </div>

                                            </>) : (<>
                                                {comment.role === 'manager' ? (<>
                                                    <div className='w-100 mb-1'>
                                                        <span
                                                            className='px-2 py-1 border-start border-3 border-danger bg-danger-subtle rounded float-start'
                                                            style={{ maxWidth: 75 + '%' }}>
                                                            <span className='text-danger fw-bold'>{comment.name} (Manager)</span> <br />
                                                            {comment.message} <br />
                                                            <small className='text-muted float-end'>{((comment.dateTime).toDate().toLocaleString('en-IN'))}</small>
                                                        </span>
                                                    </div>
                                                </>) : (<>
                                                    <div className='w-100 mb-1'>
                                                        <span
                                                            className='px-2 py-1 border-start border-3 border-primary bg-primary-subtle rounded float-start'
                                                            style={{ maxWidth: 75 + '%' }}>
                                                            <span className='text-primary fw-bold'>{comment.name}</span> <br />
                                                            {comment.message} <br />
                                                            <small className='text-muted float-end'>{((comment.dateTime).toDate().toLocaleString('en-IN'))}</small>
                                                        </span>
                                                    </div>
                                                </>)}

                                            </>)}
                                        </>
                                    ))}
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

export default ViewProjectEmployee
