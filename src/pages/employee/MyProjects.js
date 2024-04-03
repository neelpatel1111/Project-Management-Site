import React, { useState, useEffect } from 'react'
import { db } from '../../firebase/firebase'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MyProjects = () => {

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.user)

    useEffect(() => {
        db.collection('project').get()
            .then((snapshot) => {
                let tempArray = []
                snapshot.docs.forEach((doc) => {
                    let isSelected = false;
                    doc.data().tasks.forEach((task) => {
                        task.employees.forEach(employee => {
                            if (employee.userId === user.userId) {
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
        <>
            <div className="container my-4">
            <h3 className='mb-4'>My Projects</h3>
                {loading === false ? (<>
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {projects.map((item, index) => (<>
                            <Link
                                to={`/employee/viewproject/${item.projectId}`}
                                className="col text-decoration-none" >
                                <div class="card h-100 border-primary-subtle shadow-sm">
                                    <h4 className='card-header bg-primary-subtle border-0 text-primary'>{item.title}</h4>

                                    <div class="card-body">
                                        <span className='card-text'>{item.description}</span>
                                    </div>
                                    <div class="card-footer bg-white border-0">
                                        <small class="text-secondary">Due: {item.dueDate}</small>
                                    </div>
                                </div>
                            </Link>
                        </>))}

                    </div>
                </>) : (<>
                    No Projects
                </>)}

            </div>
        </>
    )
}

export default MyProjects
