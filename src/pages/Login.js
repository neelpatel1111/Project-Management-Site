import { React, useState } from 'react'
import LoginGif from '../img/loginpage.gif';
import { Link } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { useDispatch } from 'react-redux'
import { setUserLogin } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch()
    const navigate = useNavigate()

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

    // Form Variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    // Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault()
        db.collection(role).where('email', '==', email).get()
            .then((snapshot) => {
                // email does not exists
                if (snapshot.empty) {
                    Toast.fire({
                        icon: "error",
                        title: "No account found with this email"
                    });
                }
                else {
                    // password does not exists
                    snapshot.forEach((doc) => {
                        if (doc.data().password === password) {

                            Toast.fire({
                                icon: "success",
                                title: "Log in successfully"
                            });

                            dispatch(setUserLogin(doc.data()))
                            if (role === 'manager') {
                                navigate('/manager')
                            } else {
                                navigate('/employee')
                            }

                        } else {
                            Toast.fire({
                                icon: "error",
                                title: "Wrong Password"
                            });
                        }
                    })

                }
            })

    }

    return (
        <>
            <div className="d-flex mt-5 bg-white rounded mx-5 p-5">
                <div className='row w-100 m-auto'>

                    <div className='col-md-6 d-flex justify-content-end'>
                        <img src={LoginGif} alt="Login gif" className='w-75 h-75 mt-5' />
                    </div>

                    <div className='col-md-4'>
                        <div className='d-flex align-items-center mt-2'>
                            <div class="m-auto">
                                <form className='form' onSubmit={handleSubmit}>

                                    <h3 className='my-3'>Login</h3>

                                    <div class="form-group row my-2">
                                        <div className='col-12'>
                                            <input
                                                type="email"
                                                onChange={(e) => setEmail(e.target.value)}
                                                class="form-control py-2"
                                                placeholder='Email'
                                                required />
                                        </div>
                                    </div>

                                    <div class="form-group row my-2">
                                        <div class="col-12">
                                            <div className='d-flex'>

                                                <input
                                                    type={showPassword === true ? "text" : "password"}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    class="form-control py-2 rounded-end-0"
                                                    id="password"
                                                    placeholder='Password'
                                                    required />

                                                <button
                                                    type="button"
                                                    className='btn text-secondary pt-1 border border-start-0 rounded-start-0'
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
                                    </div>

                                    <div className="form-group row my-2">
                                        <div class="col-12">
                                            <select
                                                onChange={(e) => setRole(e.target.value)}
                                                class="form-select py-2"
                                                id="role"
                                                required>
                                                <option selected disabled value="">Select Role...</option>
                                                <option value="manager">Manager</option>
                                                <option value="employee">Employee</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="form-group row my-3">
                                        <div className='col-12'>
                                            <button class="btn btn-primary w-100 py-2" type="submit">Login</button>
                                        </div>
                                    </div>

                                    <div className="form-group row my-2">
                                        <div className="col-12 text-center">
                                            <hr />Don't have an account? <Link to="/register">Register</Link>
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

export default Login
