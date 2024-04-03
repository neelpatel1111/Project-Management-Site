import { React, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MultiSelect } from "react-multi-select-component";
import Swal from 'sweetalert2';
import { db } from '../../firebase/firebase';

const EditTask = () => {

    const { projectId, taskId } = useParams();
    const [selected, setSelected] = useState([]);
    const [options, setOptions] = useState([]);
    const [title, setTitle] = useState();
    const [desc, setDesc] = useState();

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

    const getData = () => {
        db.collection("project").where("projectId", "==", projectId)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {

                    doc.data().tasks.map((task) => {
                        if (task.taskId === taskId) {
                            setTitle(task.title);
                            setDesc(task.description);
                            let emp = []
                            task.employees.map((employee) => {
                                emp.push({
                                    label: employee.name,
                                    value: employee.userId
                                })
                            })
                            setSelected(emp);
                        }
                    })
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    const getEmployeeOptions = () => {
        db.collection('employee').get()
            .then(snapshot => {
                let employees = []
                snapshot.forEach((doc) => {
                    employees.push({ label: doc.data().name, value: doc.data().userId })
                })
                setOptions([...options, ...employees])
            })
    }

    const onSubmit = (e) => {
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

            // set new task
            const updatedTask = {
                taskId: taskId,
                title: title,
                description: desc,
                employees: employees,
                workPercentage: null
            }

            db.collection("project").where("projectId", "==", projectId)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {

                        let tasks = doc.data().tasks.map((item) => item)

                        let t = tasks.map((task) => {
                            if ((task.title).toLowerCase() === title.toLowerCase() && task.taskId !== taskId) {
                                isAlready = true;
                            }
                        })

                        if (isAlready === true) {
                            Toast.fire({
                                icon: "info",
                                title: `Task with Title "${title}" already exists.`
                            });
                        } else {

                            for (let i = 0; i < tasks.length; i++) {
                                if (tasks[i].taskId === taskId) {
                                    tasks[i] = updatedTask
                                }
                            }

                            doc.ref.update({
                                tasks: tasks
                            }).then(() => {
                                Toast.fire({
                                    icon: "success",
                                    title: `Task Updated Successfully`
                                });
                            })

                        }
                    });
                })

        } else {
            Toast.fire({
                icon: "warning",
                title: `Please fill out all fields`
            });
        }

    }

    useEffect(() => {
        getData();
        getEmployeeOptions();
    }, []);

    return (
        <>
            <div className="container mt-5 mx-auto">
                <form onSubmit={onSubmit}>
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-4 bg-white border rounded shadow-sm">
                            <h4 className=''>Edit Task</h4>
                            <hr />
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
                                <label for="desc" class="form-label">Description</label>
                                <textarea
                                    class="form-control"
                                    id="desc"
                                    rows="3"
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    required></textarea>
                            </div>

                            <div className='mb-3'>
                                <label for="employees"
                                    className="form-label">
                                    Employees
                                </label>
                                <MultiSelect
                                    options={options}
                                    value={selected}
                                    onChange={setSelected}
                                    labelledBy="employees"
                                />
                            </div>

                            <div>
                                <button type="submit" className='btn btn-primary bg-gradient'>Update</button>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </>
    )
}

export default EditTask
