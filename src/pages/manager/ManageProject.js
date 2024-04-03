import { React, useState, useEffect } from 'react'
import { db } from '../../firebase/firebase'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const ManageProject = () => {

    const { projectId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState();
    const [dueDate, setDueDate] = useState();
    const [desc, setDesc] = useState();
    const [project, setProject] = useState({});
    const [loading, setLoading] = useState(true);

    // Get Project Data From Firebase
    const getData = () => {
        db.collection('project').where('projectId', '==', projectId)
            .onSnapshot((snapshot) => {
                snapshot.forEach((doc) => {
                    setProject(doc.data())
                    setTitle(doc.data().title)
                    setDueDate(doc.data().dueDate)
                    setDesc(doc.data().description)
                    setLoading(false)
                });
            })
    }

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

    // submit the form to update project in firebase
    const handleSubmit = (e) => {
        e.preventDefault()
        let isAlready = false;
        if (title !== '' && dueDate !== '' && desc !== '') {

            db.collection("project").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if ((doc.data().projectId !== projectId) && (doc.data().title).toLowerCase() === title.toLowerCase()) {
                        isAlready = true
                    }
                });

                if (!isAlready) {
                    db.collection("project").where("projectId", "==", projectId)
                        .get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                doc.ref.update({
                                    title: title,
                                    dueDate: dueDate,
                                    description: desc
                                }).then(() => {
                                    Toast.fire({
                                        icon: "success",
                                        title: `Project Updated Successfully`
                                    });
                                })
                            });
                        })

                } else {
                    Toast.fire({
                        icon: "info",
                        title: `Project with Title "${title}" already exists.`
                    });
                }
            });


        } else {
            Toast.fire({
                icon: "warning",
                title: `Please fill out all fields`
            });
        }
    }

    // delete project
    const deleteProject = () => {
        try {
            Swal.fire({
                title: `Are you sure to delete Project "${title}" ?`,
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
                width: 450
            }).then((result) => {
                if (result.isConfirmed) {

                    db.collection("project").where('projectId', '==', projectId).get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                db.collection('project').doc(doc.id).delete()
                            })
                        })

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your Project has been deleted.",
                        icon: "success",
                        width: 450
                    });

                    navigate('/manager/dashboard')

                }
            });

        } catch (error) {
            console.error(error)
        }

    }

    // delete task
    const deleteTask = (id, title) => {
        Swal.fire({
            title: `Are you sure to delete task "${title}" ?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            width: 450
        }).then((result) => {
            if (result.isConfirmed) {

                db.collection('project').where('projectId', '==', projectId).get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            const t = doc.data().tasks.map((item) => item)
                            const new_t = t.filter(val => val.taskId !== id)

                            doc.ref.update({
                                tasks: new_t
                            })

                            Swal.fire({
                                title: "Deleted!",
                                text: "Your task has been deleted.",
                                icon: "success",
                                width: 450
                            });
                        });
                    })


            }
        });

    }

    useEffect(() => {
        getData()
    }, []);

    return (
        <>
            <div className="container my-4 mx-auto  bg-white border rounded p-3">
                <div className='text-dark d-flex justify-content-between '>
                    <span className='float-start me-3'>
                        <Link 
                        to={`/manager/viewproject/${projectId}`}
                        className='link-dark'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-square-fill" viewBox="0 0 16 16">
                                <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1" />
                            </svg>
                        </Link>
                    </span>
                    <span>
                        <h4>Manage Project</h4>
                    </span>
                    <span className='float-end pe-2 pt-0'>
                        <button
                            onClick={() => deleteProject()}
                            className='btn btn-danger bg-gradient py-1 mt-0'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-octagon mb-1" viewBox="0 0 16 16">
                                <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z" />
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg> Delete
                        </button>
                    </span>
                </div>
                <hr />
                {loading === false ? (<>
                    <div className="row g-3">
                        {/* Project Deatils */}
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                            <form onSubmit={handleSubmit}>
                                <div class="mb-3">
                                    <label for="title" class="form-label">Title</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required />
                                </div>
                                <div class="mb-3">
                                    <label for="duedate" class="form-label">Due Date</label>
                                    <input
                                        type="date"
                                        class="form-control"
                                        id="duedate"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        required />
                                </div>
                                <div class="mb-3">
                                    <label for="desc" class="form-label">Description</label>
                                    <textarea
                                        class="form-control"
                                        id="desc"
                                        rows="3"
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        required></textarea>
                                </div>
                                <div className="">
                                    <button type="submit" className='btn btn-primary bg-gradient'>Update</button>
                                </div>
                            </form>
                        </div>

                        {/* Tasks */}
                        <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                            <div className="h-100 px-3">

                                <h5 className='text-center mb-3'>Tasks
                                    <span className='float-end mx-2'>
                                        <Link
                                            to={`/manager/${projectId}/addtask`} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-plus-circle-fill text-success bg-gradient" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                                            </svg>
                                        </Link>
                                    </span>
                                </h5>


                                <div className="card p-2 border overflow-auto">
                                    <table className="table table-hover table-responsive align-middle">
                                        <thead className="table-head">
                                            <tr>
                                                <th>Task</th>
                                                <th>Actions</th>
                                                <th>Description</th>
                                                <th>Employees</th>
                                            </tr>
                                        </thead>
                                        <tbody className='table-body'>
                                            {project.tasks.map((task) => (<>
                                                <tr>
                                                    <td>{task.title}</td>
                                                    <td>
                                                        <Link
                                                            to={`/manager/${projectId}/editTask/${task.taskId}`}
                                                            className='me-3'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square text-warning" viewBox="0 0 16 16">
                                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            className='btn btn-sm p-0 m-0 border-0 bg-gradient'
                                                            onClick={() => deleteTask(task.taskId, task.title)} >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill text-danger mb-1" viewBox="0 0 16 16">
                                                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                                            </svg>
                                                        </button>
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
                                                </tr>
                                            </>))}
                                        </tbody>
                                    </table>

                                </div>
                            </div>

                        </div>
                    </div>
                </>) : (<>Loading...</>)}
            </div>
        </>
    )
}

export default ManageProject
