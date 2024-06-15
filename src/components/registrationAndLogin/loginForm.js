import { useState } from "react";
import * as Yup from 'yup';
import axios from 'axios'
import '../../login.css' 
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, FormGroup, FormLabel, FormControl, Alert } from 'react-bootstrap';
import { startGetRequests, startGetMyRequests } from "../../actions/request-action";
import { startGetCustomerOrders, startGetSupplierOrders } from "../../actions/orders-action";
import { useDispatch } from "react-redux";

export default function LoginForm(props) {
    const [serverErrors, setServerErrors] = useState([]);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { handleLogin } = useAuth()
    const initialValues = {
        email: '',
        password: '',
    };

    // Define the validation schema using Yup
    const loginValidationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email Id')
            .required('Email is required'),
            
        password: Yup.string()
            .required('Password is required'),
    });

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post('http://localhost:3100/api/users/login', values)
            localStorage.setItem('token', response.data.token)
            const userResponse = await axios.get('http://localhost:3100/api/users/account', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            if (userResponse.data.role === 'customer') {
                dispatch(startGetRequests());
                dispatch(startGetCustomerOrders());
                navigate('/customer-dashboard')
            }
            if (userResponse.data.role === 'supplier') {
                dispatch(startGetMyRequests());
                dispatch(startGetSupplierOrders());
                navigate('/supplier-dashboard')
            }
            props.setLogin()
            handleLogin(userResponse.data)
            navigate('/login-success')
            setServerErrors([])

        } catch (error) {
            console.log(error)
            //setServerErrors(Array.isArray(error.response?.data?.error) ? error.response.data.error : [error.response.data.error]);
            //setServerErrors(error.response.data)
            setServerErrors(
                Array.isArray(error.response?.data?.errors)
                  ? error.response.data.errors.map((error) => error.msg)
                  : [error.response.data.msg]
            );
        }
    }

    return (
        // <div className="login-container" style={{ backgroundColor: '#ADD8E6' }}> {/* Apply the blue background color */}
        <div className="login-container"  style={{ backgroundColor: '#ADD8E6' }}> {/* Apply the login-container class */}
            <div className="spacer"></div> {/* Add a spacer div for space */}
            <div className="loginForm"> {/* Apply the loginForm class */}

                <h1>Login</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={loginValidationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        {serverErrors.length > 0 && (
                            <Alert variant="danger">
                                {serverErrors.map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </Alert>
                        )}
                        
                        <FormGroup controlId="email" className="form-group"> 
                            <FormLabel className="form-label">Email : </FormLabel> 
                            <Field
                                type="email"
                                name="email"
                                placeholder="Enter Email Id"
                                as={FormControl}
                                className="form-control" 
                            />
                            <ErrorMessage name="email" component="div" className="error-message" />
                        </FormGroup><br />

                        <FormGroup controlId="password" className="form-group">
                            <FormLabel className="form-label">Password : </FormLabel>
                            <Field
                                type="password"
                                name="password"
                                placeholder="Enter Password"
                                as={FormControl}
                                className="form-control"
                            />
                            <ErrorMessage name="password" component="div" className="error-message" />
                        </FormGroup><br />

                        <Button type="submit" className="login-button">Login</Button><br /><br /> {/* Apply the login-button class */}
                        <Link to='/forgot-password' style={{ color: 'black' }}><b>Forgot Password?</b></Link><br /><br />
                        <Link to='/register' style={{ color: 'black' }}><b>New User? Register here</b></Link>
                    </Form>
                </Formik>
            </div>
        </div>
        // </div>
    )

}
