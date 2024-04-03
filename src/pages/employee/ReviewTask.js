import React, { useState, useEffect } from 'react'
import { db } from '../../firebase/firebase'
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

const ReviewTask = () => {
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
                            if (employee.status === 'In Review') {
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
        <h3 className='mb-4'>Review Tasks</h3>
            {loading === false ? (<>
                <div className='row'>
                    {projects.map((item, index) => (<>
                        <div className='col-lg-6 col-md-6'>
                            <div className='card mb-3  shadow-sm'>
                                <h4 className='card-header bg-white'>{item.title}</h4>
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
                                                    {emp.status === 'In Review' ? (<>
                                                        <tr>
                                                        <td>{task.title}</td>
                                                        <td>{task.description}</td>
                                                        <td><i>{emp.status}</i></td>
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

export default ReviewTask
