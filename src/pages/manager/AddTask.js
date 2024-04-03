import { React, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MultiSelect } from "react-multi-select-component";
import { db } from '../../firebase/firebase';
import uuid4 from 'uuid4';
import Swal from 'sweetalert2';

const CreateTask = () => {

    const { projectId } = useParams();
    const [selected, setSelected] = useState([]);
    const [options, setOptions] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');

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

    // Task ID
    let taskId = uuid4();
    taskId = taskId.slice(24, taskId.length)

    // submit the form to create a new project in firebase
    const handleSubmit = (e) => {
        e.preventDefault();
        let isAlready = false;

        if (title !== '' && desc !== '' && selected.length > 0) {

            // set employee data
            let employees = [];
            for (let i = 0; i < selected.length; i++) {
                employees.push({
                    userId: selected[i].value,
                    name: selected[i].label,
                    status: 'In Process'
                })
            }

            // add task to database
            db.collection('project').where('projectId', '==', projectId).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {

                        let tasks = doc.data().tasks;

                        // check title already exist
                        let t = tasks.map((task) => {
                            if ((task.title).toLowerCase() === title.toLowerCase()) {
                                isAlready = true;
                            }
                        })

                        if (isAlready === true) {
                            Toast.fire({
                                icon: "info",
                                title: `Task with Title "${title}" already exists.`
                            });
                        } else {
                            tasks.push({
                                taskId: taskId,
                                title: title,
                                description: desc,
                                employees: employees,
                                workPercentage: null,
                            })
                            doc.ref.update({
                                tasks: tasks
                            })

                            Toast.fire({
                                icon: "success",
                                title: `Task Added Successfully`
                            });
                        }

                    });
                })
        }
        else {
            Toast.fire({
                icon: "warning",
                title: `Please fill out all fields`
            });
        }
    }

    // get employee data
    useEffect(() => {
        db.collection('employee').get()
            .then(snapshot => {
                let employees = []
                snapshot.forEach((doc) => {
                    employees.push({ label: doc.data().name, value: doc.data().userId })
                })
                setOptions([...options, ...employees])
            })
    }, []);

    return (
        <>
            <div className="container mt-5 mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-4 bg-white border rounded  shadow-sm">
                            <h4 className=''>Add Task</h4>
                            <hr />
                            <div class="mb-3">
                                <label for="title" class="form-label">Title</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="title"
                                    onChange={(e) => setTitle(e.target.value)}
                                    required />
                            </div>

                            <div class="mb-3">
                                <label for="desc" class="form-label">Description</label>
                                <textarea
                                    class="form-control"
                                    id="desc"
                                    rows="3"
                                    onChange={(e) => setDesc(e.target.value)}
                                    required></textarea>
                            </div>

                            <div className='mb-3'>
                                <label for="employees" class="form-label">Employees</label>
                                <MultiSelect
                                    options={options}
                                    value={selected}
                                    onChange={setSelected}
                                    labelledBy="employees"
                                />
                            </div>

                            <div>
                                <button type="submit" className='btn btn-primary'>Add</button>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </>
    )
}

export default CreateTask
