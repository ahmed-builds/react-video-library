import { useFormik } from 'formik';
import logo from '../../logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { registrationFormContract } from '../../contracts/registration-form-contract';
import axios from 'axios';
import { useEffect, useState } from 'react';
import * as yup from "yup";

export function Registration() {

    const [createRegId, setRegId] = useState(0);
    const navigate = useNavigate();

    const [userIdAvailability, setUserIdAvailability] = useState<boolean | null>(null);
    const [userIdMsg, setUserIdMsg] = useState('');

    useEffect(() => {
        axios.get(`http://127.0.0.1:3030/get-users`).then(getAllUsers => {
            setRegId(getAllUsers.data.length);
        }).catch(reason => {
            console.log(reason);
        });
    }, []);

    const formik = useFormik<registrationFormContract>({
        initialValues: {
            regId: 0,
            username: '',
            userid: '',
            useremail: '',
            usercontact: '',
            userpassword: '',
            usergender: '',
            userType: '',
            date: ''
        },
        validationSchema: yup.object(
            {
                username: yup.string().required('Name is required'),
                useremail: yup.string().required('eMail is required').matches(/^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/, 'Invalid eMail'),
                usercontact: yup.string().required('Mobile is required').matches(/\+91\d{10}/, 'Invalid Mobile Number'),
                userid: yup.string().required('Username is required').min(4, 'Minimum 4 characters').max(20, 'Maximum 20 characters').matches(/^[a-zA-Z\d]{4,20}$/, 'Username cannot have spaces'),
                userpassword: yup.string().required('Password is required').min(8, 'Minimum 8 Characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must contain at least one lowercase, one uppercase letter, one number and no spaces'),
                usergender: yup.string().required('Gender is required')
            }
        ),
        onSubmit: (registrationDetails) => {
            var regId = createRegId + 1;
            registrationDetails.regId = regId;

            axios.post(`http://127.0.0.1:3030/register-user`, registrationDetails).then(regStatus => {
                localStorage.setItem('registrationFeedback', 'true');
                navigate('/login');
            }).catch(error => {
                // Handle error
                console.error('Error:', error.response ? error.response.data : error.message);
            });
        },
        validateOnBlur: true,
        validateOnChange: true
    });

    const checkUserIdAvailability = (userId: string) => {
        if (userId.trim() === '') {
            return;
        }
        axios.get(`http://127.0.0.1:3030/validate-user/${userId}`).then(response => {
            if (response.data) {
                setUserIdMsg('Username not Available');
                setUserIdAvailability(false);
            } else {
                setUserIdMsg('');
                setUserIdAvailability(true);
            }
        })
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>

            <div className="card">
                <div className="card-header text-center">
                    <img src={logo} alt="App Logo" style={{ width: "25%" }} />
                    <h3 className="card-title"><span className='bi bi-person'></span> Registration</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-floating mb-3">
                            <input type="text" className={`form-control ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`} id="floatingUserName" name="username" placeholder="Name" onChange={formik.handleChange} onBlur={formik.handleBlur} autoFocus />
                            <label htmlFor="floatingUserName">Name</label>
                            <span className='text-danger'>{formik.touched.username && formik.errors.username}</span>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="email" className={`form-control ${formik.touched.useremail && formik.errors.useremail ? 'is-invalid' : ''}`} id="floatingEmail" name="useremail" placeholder="Email" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            <label htmlFor="floatingEmail">Email</label>
                            <span className='text-danger'>{formik.touched.useremail && formik.errors.useremail}</span>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className={`form-control ${formik.touched.usercontact && formik.errors.usercontact ? 'is-invalid' : ''}`} id="floatingContact" name="usercontact" placeholder="Contact" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            <label htmlFor="floatingContact">Contact</label>
                            <span className='text-danger'>{formik.touched.usercontact && formik.errors.usercontact}</span>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className={`form-control ${formik.touched.userid && formik.errors.userid ? 'is-invalid' : ''}`} id="floatingUserId" name="userid" placeholder="Username" onChange={(e) => { formik.handleChange(e); checkUserIdAvailability(e.target.value);}} onBlur={formik.handleBlur} />
                            <label htmlFor="floatingUserId">Username</label>
                            <span className='text-danger'>{formik.touched.userid && formik.errors.userid}</span>
                            <span className="text-danger">{userIdMsg}</span>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className={`form-control ${formik.touched.userpassword && formik.errors.userpassword ? 'is-invalid' : ''}`} id="floatingPassword" name="userpassword" placeholder="Password" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            <label htmlFor="floatingPassword">Password</label>
                            <span className='text-danger'>{formik.touched.userpassword && formik.errors.userpassword}</span>
                        </div>
                        <div className="mb-3">
                            <select name="usergender" id="floatingGender" className={`form-control ${formik.touched.usergender && formik.errors.usergender ? 'is-invalid' : ''}`} onChange={formik.handleChange} onBlur={formik.handleBlur} >
                                <option value="">Select Gender</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                            </select>
                            <span className='text-danger'>{formik.touched.usergender && formik.errors.usergender}</span>
                        </div>                        
                        <div className="mb-3">
                            <button type="submit" className="btn btn-outline-primary fs-5" disabled={(formik.isValid)?false:true}><span className='bi bi-person'></span> Register</button>
                        </div>
                        <div className="mb-3 text-center">
                            <p>Already have an account? <Link to="/login">Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}