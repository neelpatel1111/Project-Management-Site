import React, { useState, useEffect } from 'react'
import { db } from '../../firebase/firebase'
import { Link } from 'react-router-dom';

const CompletedProjects = () => {

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [temp, setTemp] = useState([])

    //  Get all projects
    const getProjects = () => {
        db.collection('project').onSnapshot((snapshot) => {
                let tempArray = []
                snapshot.docs.forEach((doc) => {
                    tempArray.push({ id: doc.id, ...doc.data() })
                });
                setTemp(tempArray);
                
            })                      
    }
                        
    const calculateWorkAndProjectPercentages = (projectsArray) => {
        
        let updatedProjects = projectsArray.map(project => {
            if (project.tasks) {
                let tasks = project.tasks;
                let workPercentage = 0;
                
                tasks.forEach(task => {
                    let counter = 0;
                    task.employees.forEach(emp => {
                        if (emp.status === "Completed") {
                            counter++;
                        }
                    });
                    task.workPercentage = (counter * 100) / task.employees.length;
                    workPercentage += task.workPercentage; 
                });
    
                project.projectPercentage = workPercentage / tasks.length;
            }
            return project;
        });
    
        return updatedProjects;
    }

    useEffect(() => {
        getProjects()
    }, []);

    useEffect(() => {
        if (temp.length > 0) {
            const updatedProjects = calculateWorkAndProjectPercentages(temp);
            setProjects(updatedProjects);
            setLoading(false);
        }
    }, [temp])

    return (                   
        <>
            <div className="container mt-4 px-4">

                {loading === false ? (<>
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        
                        {projects.map((item, index) => (<>
                            {item.projectPercentage === 100 ? (<>
                                <Link
                                to={`/manager/viewproject/${item.projectId}`}
                                className="col text-decoration-none" >
                                <div class="card border-success-subtle h-100 shadow-sm">
                                    <h4 className='card-header bg-success-subtle bg-gradient text-success border-0'>{item.title}</h4>

                                    <div class="card-body">
                                        <span className='card-text'>{item.description}</span>
                                    </div>
                                    <div class="card-footer bg-white border-0">
                                        <small class="text-secondary">
                                            Due: {item.dueDate} <br /> 
                                            Progress: {parseFloat(item.projectPercentage).toFixed(1)}%
                                        </small>
                                    </div>
                                </div>
                            </Link>
                            </>) : (<></>)}
            
                        </>))}

                    </div>
                </>) : (<>
                    No Projects
                </>)}

            </div>
        </>
    )
}

export default CompletedProjects
