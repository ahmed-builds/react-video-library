import { useFormik } from 'formik';
import logo from '../../logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as yup from "yup";
import axios from 'axios';
import { useCookies } from 'react-cookie';

export function Login() {

    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();
    const [userNameError, setUserNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [cookies, setCookie, removeCookie] = useCookies(['userId']);

    useEffect(() => {
        const registrationFeedback = localStorage.getItem('registrationFeedback');
        if (registrationFeedback === 'true') {
            if (showToast === false) {
                setShowToast(true);

                setTimeout(() => {
                    setShowToast(false);
                    localStorage.removeItem('registrationFeedback');
                }, 3000);
            }
        }
    }, [showToast]);


    const formik = useFormik({
        initialValues: {
            username: '',
            userpassword: '',
        },
        validationSchema: yup.object({
            username: yup.string().required('Username is required'),
            userpassword: yup.string().required('Password is required'),
        }),
        onSubmit: (loggedIn) => {
            axios.get(`http://127.0.0.1:3030/validate-user/${loggedIn.username}`).then(response=>{
                if(response.data){
                    var userDetails = response.data;
                    if(userDetails.password === loggedIn.userpassword){
                        setUserNameError('');
                        setPasswordError('');

                        let userType = userDetails.userType;

                        setCookie('userId', userDetails.regId);

                        if(userType === 'A'){
                            navigate('/dashboard');
                        } else {
                            navigate('/')
                        }
                    } else {
                        setUserNameError('');
                        setPasswordError('Invalid Password');
                    }
                } else {
                    setPasswordError('');
                    setUserNameError('Invalid Username');
                }
            });
        },
        validateOnBlur: true,
        validateOnChange: true
    });
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="card">

                <div className="card-header text-center">
                    <img src={logo} alt="App Logo" style={{ width: "25%" }} />
                    <h3 className="card-title"><span className='bi bi-box-arrow-in-right'></span> Login</h3>
                </div>
                <div className="card-body">

                    {showToast && (
                        <div className="toast fade show align-items-center text-bg-primary border-0 mb-3" role="alert" aria-live="assertive" aria-atomic="true">
                            <div className="d-flex">
                                <div className="toast-body">
                                    Registered Successfully!
                                </div>
                                <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="floatingUserName" name="username" placeholder="Username" onChange={formik.handleChange} onBlur={formik.handleBlur} autoFocus />
                            <label htmlFor="floatingUserName">Username</label>
                            <span className="text-danger">{formik.touched.username && formik.errors.username}{userNameError}</span>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" id="floatingPassword" name="userpassword" placeholder="Password" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            <label htmlFor="floatingPassword">Password</label>
                            <span className="text-danger">{formik.touched.userpassword && formik.errors.userpassword}{passwordError}</span>
                        </div>
                        <div className="mb-3 d-grid">
                            <button type="submit" className="btn btn-primary fs-5"><span className='bi bi-box-arrow-in-right'></span> Login</button>
                        </div>
                        <div className="mb-3 text-center">
                            <p>Don't have an account? <Link to="/register">Register</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}