import React, { useState, useEffect } from 'react'
import { db } from '../../firebase/firebase'
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

const CompletedTask = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.user)

    useEffect(() => {
        db.collection('project').onSnapshot((snapshot) => {
            let tempArray = []
            snapshot.docs.forEach((doc) => {
                let isSelected = false;
                doc.data().tasks.forEach((task) => {
                    task.employees.forEach(employee => {
                        if (employee.userId === user.userId) {
                            if (employee.status === 'Completed') {
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

    return (
        <div className="container my-4">
            <h3 className='mb-4'>Completed Tasks</h3>
            {loading === false ? (<>
                <div className='row'>
                    {projects.map((item, index) => (<>
                        <div className='col-12'>
                            <div className='card mb-3 shadow-sm'>
                                <h4 className='card-header '>{item.title}</h4>
                                <div className='card-body'>
                                    <table className='table table-hover table-responsive align-middle'>
                                        <thead className='table-head'>
                                            <tr>
                                                <th>Title</th>
                                                <th>Description</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className='table-body'>
                                            {item.tasks.map((task) => (<>
                                                {task.employees.filter(emp => emp.userId === user.userId).map(emp => (<>
                                                    {emp.status === 'Completed' ? (<>
                                                        <tr>
                                                            <td>{task.title}</td>
                                                            <td>{task.description}</td>
                                                            <td>
                                                                <i className='text-success'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill mb-1" viewBox="0 0 16 16">
                                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                                    </svg>
                                                                    &nbsp;
                                                                    {emp.status}
                                                                </i>
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

export default CompletedTask
