import React from 'react'
import { Link } from 'react-router-dom'

const NotAuth = () => {
    return (
        <div className='container text-center mt-5'>
            You are not authorized
            <div>
                <Link
                    to={'/login'}
                    className='link link-primary'>
                    Login
                </Link>
            </div>
        </div>
    )
}

export default NotAuth
