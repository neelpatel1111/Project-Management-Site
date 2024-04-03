import { React, useState } from 'react'
import LoginGif from '../img/register.gif'
import { Link, useNavigate } from 'react-router-dom'
import uuid4 from 'uuid4'
import { db } from '../firebase/firebase'

const Register = () => {

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // generate userId
    let userId = uuid4();
    userId = userId.slice(24, userId.length)

    // Form Variables
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [c_password, setC_Password] = useState('')
    const [role, setRole] = useState('')
    const [company, setCompany] = useState('')

    // Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault()
        if (name === '' || email === '' || password === '' || c_password === '' || company === '' || role === '') {
            alert("Please fill out all fields")
        } else {
            if (password !== c_password) {
                alert("Password and confirm password not matched")
            } else {

                db.collection(role).where('email','==', email).get()
                    .then(snapshot => {
                        if (snapshot.empty) {

                            // Document doesn't exist, add the new data
                            db.collection(role).add({
                                userId: userId,
                                name: name,
                                email: email,
                                password: password,
                                company: company,
                                role: role
                            })
                                .then((docRef) => {
                                    console.log("Document written with ID: ", docRef.id);
                                    alert("Registed Successfully")
                                    navigate("/login")
                                })
                                .catch((error) => {
                                    console.error("Error adding document: ", error);
                                });
                        }
                        else {
                            alert('Email already in use')
                        }

                    })
                }

            }
        }

            return (
                <>
                    <div className="d-flex mt-5 bg-white rounded mx-5 p-5">
                        <div className='row w-100 m-auto'>
                            <div className='col-md-6'>
                                <img src={LoginGif} alt="Login gif" className='w-100 mt-5' />
                            </div>
                            <div className='col-md-6'>
                                <div className='d-flex align-items-center mt-2'>
                                    <div class="m-auto">

                                        <form class="row g-3" onSubmit={handleSubmit}>

                                            <h3>Register</h3>

                                            <div class="col-md-6">
                                                <label for="name" class="form-label">Full Name</label>
                                                <input
                                                    type="text"
                                                    onChange={(e) => { setName(e.target.value) }}
                                                    class="form-control"
                                                    id="name"
                                                    required />
                                            </div>

                                            <div class="col-md-6">
                                                <label for="email" class="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    onChange={(e) => { setEmail(e.target.value) }}
                                                    class="form-control"
                                                    id="email"
                                                    required />
                                            </div>

                                            <div class="col-md-6">
                                                <label for="password" class="form-label">Password</label>
                                                <div className='d-flex'>

                                                    <input
                                                        type={showPassword === true ? "text" : "password"}
                                                        onChange={(e) => { setPassword(e.target.value) }}
                                                        class="form-control rounded-end-0"
                                                        id="password"
                                                        required />

                                                    <button
                                                        type="button"
                                                        className='btn pt-1 text-secondary border border-start-0 rounded-start-0'
                                                        onClick={() => setShowPassword(showPassword === true ? false : true)}>
                                                        {showPassword === true ? (<>
                                                            {/* Open eye */}
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                                            </svg>
                                                        </>) : (<>
                                                            {/* Close eye */}
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                                                <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                                                                <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                                                            </svg>
                                                        </>)}

                                                    </button>
                                                </div>

                                            </div>

                                            <div class="col-md-6">
                                                <label for="c_password" class="form-label">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    onChange={(e) => setC_Password(e.target.value)}
                                                    class="form-control"
                                                    id="c_password"
                                                    required />
                                            </div>


                                            <div class="col-md-6">
                                                <label for="company" class="form-label">Company</label>
                                                <input
                                                    type="text"
                                                    onChange={(e) => setCompany(e.target.value)}
                                                    class="form-control"
                                                    id="company"
                                                    required />
                                            </div>

                                            <div class="col-md-3">
                                                <label for="role" class="form-label">Role</label>
                                                <select
                                                    onChange={(e) => setRole(e.target.value)}
                                                    class="form-select"
                                                    id="role"
                                                    value={role}
                                                    required>
                                                    <option selected disabled value="">Choose...</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="employee">Employee</option>
                                                </select>
                                            </div>

                                            <div class="col-12">
                                                <button class="btn btn-primary" type="submit">Register</button>
                                            </div>

                                            <div className="form-group row my-2">
                                                <div className="col-sm-12 text-center">
                                                    <hr />Already have an account? <Link to="/login">Login</Link>
                                                </div>
                                            </div>

                                        </form>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                </>
            )
        }

        export default Register
