import { React, useState } from 'react'
import uuid4 from 'uuid4';
import { db } from '../../firebase/firebase'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CreateProject = () => {

    // generate projectId
    let projectId = uuid4();
    // make projectId 12 length
    projectId = projectId.slice(24, projectId.length)

    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [desc, setDesc] = useState('');

    const navigate = useNavigate();

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

    // submit the form to create a new project in firebase
    const handleSubmit = (e) => {
        e.preventDefault();
        let isAlready = false;

        if (title !== '' && dueDate !== '' && desc !== '') {

            // Checking duplicate title
            db.collection("project").get()
                .then((querySnapshot) => {

                    querySnapshot.forEach((project)=>{
                        if ((project.data( ).title).toLowerCase() === title.toLowerCase()) {
                            isAlready = true;
                        }
                    })

                    if (isAlready === true) {
                        Toast.fire({
                            icon: "info",
                            title: `Project with Title "${title}" already exists.`
                        });
                    } else { 
                        // add data into project collection 
                        db.collection('project').add({
                            projectId: projectId,
                            title: title,
                            dueDate: dueDate,
                            description: desc,
                            tasks: [],
                            comments: []
                        })
                            .then((docRef) => {
                                Toast.fire({
                                    icon: "success",
                                    title: `Project Created Successfully`
                                });
                                navigate(`/manager/${projectId}/addtask`)
                            })
                            .catch((error) => {
                                console.error("Error adding document: ", error);
                            });
                    }



                })
        }
        else {
            Toast.fire({
                icon: "warning",
                title: `Please fill out all fields`
            });
        }
    }

    return (
        <>
            <div className="container mt-5 mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-4 bg-white border rounded shadow-sm">
                            <h4 className=''>Create Project</h4>
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
                                <label for="duedate" class="form-label">Due Date</label>
                                <input
                                    type="date"
                                    class="form-control"
                                    id="duedate"
                                    onChange={(e) => setDueDate(e.target.value)}
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
                            <div className="">
                                <button type="submit" className='btn btn-primary bg-gradient'>Create</button>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </>
    )
}

export default CreateProject
