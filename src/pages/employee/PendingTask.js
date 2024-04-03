import React, { useState, useEffect } from 'react'
import { db, storage } from '../../firebase/firebase'
import { useSelector } from 'react-redux';
import uuid4 from 'uuid4';
import Swal from 'sweetalert2'

const PendingTask = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.user)
    const [file, setFile] = useState()

    useEffect(() => {
        db.collection('project').onSnapshot((snapshot) => {
            let tempArray = []
            snapshot.docs.forEach((doc) => {
                let isSelected = false;
                doc.data().tasks.forEach((task) => {
                    task.employees.forEach(employee => {
                        if (employee.userId === user.userId) {
                            if (employee.status === 'In Process') {
                                if (isSelected === false) {
                                    tempArray.push({ ...doc.data(), id: doc.id })
                                    isSelected = true
                                }
                            }
                        }
                    })
                });
            })
            setProjects(tempArray);
            setLoading(false);
        });

    }, [])

    // make done function
    const markDone = (projectId, taskId) => {

        if (!file) {
            Swal.fire({
                title: "Please submit your file",
                icon: "warning",
                width: 450
            })
        }
        else {

            Swal.fire({
                title: "Want to mark this task for review ?",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
                width: 450
            }).then(async (result) => {
                if (result.isConfirmed) {

                    // generate file ID
                    let fileId = uuid4();
                    // make file ID 12 length
                    fileId = fileId.slice(24, fileId.length)

                    const fileRef = storage.ref().child(`review-files/${fileId}`)
                    await fileRef.put(file)
                    const fileURL = await fileRef.getDownloadURL()

                    db.collection("project").where('projectId', "==", projectId).get()
                        .then(projects => {

                            projects.forEach((project) => {

                                let newTasks = project.data().tasks

                                for (let i = 0; i < newTasks.length; i++) {
                                    if (newTasks[i].taskId === taskId) {

                                        for (let j = 0; j < (newTasks[i].employees).length; j++) {

                                            if ((newTasks[i].employees[j]).userId === user.userId) {
                                                (newTasks[i].employees[j]).status = 'In Review';
                                                (newTasks[i].employees[j]).fileURL = fileURL;
                                            }

                                        }


                                    }
                                }

                                project.ref.update({
                                    tasks: newTasks
                                }).then(() => {
                                    Swal.fire({
                                        title: "Task submited for review!",
                                        icon: "success",
                                        width: 450
                                    });
                                })
                            })

                        })

                }
            });
        }


    }

    return (
        <div className="container my-4">
            <h3 className='mb-4'>Pending Tasks</h3>
            {loading === false ? (<>
                <div className='row'>
                    {projects.map((item, index) => (<>
                        <div className='col-lg-12 col-md-12'>
                            <div className='card mb-3 shadow-sm'>
                                <h4 className='card-header'>{item.title}</h4>
                                <div className='card-body'>
                                    <table className='table table-hover table-responsive align-middle'>
                                        <thead className='table-head'>
                                            <tr>
                                                <th>Title</th>
                                                <th>Description</th>
                                                <th>Attachments</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className='table-body'>
                                            {item.tasks.map((task) => (<>
                                                {task.employees.filter(emp => emp.userId === user.userId).map(emp => (<>
                                                    {emp.status === 'In Process' ? (<>
                                                        <tr>
                                                            <td>{task.title}</td>
                                                            <td>{task.description}</td>
                                                            <td>
                                                                <input
                                                                    className="form-control form-control-sm"
                                                                    type="file"
                                                                    onChange={(e) => setFile(e.target.files[0])}
                                                                    required />
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className='btn btn-sm btn-success'
                                                                    type='submit'
                                                                    onClick={() => markDone(item.projectId, task.taskId)}>
                                                                    Review
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </>) : (<></>)}
                                                </>))}
                                            </>))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div >
                    </>))}
                </div>
            </>) : (<>
                Loading...
            </>)
            }

        </div >
    )
}

export default PendingTask
