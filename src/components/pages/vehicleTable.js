import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Alert } from 'react-bootstrap';
import * as Yup from 'yup';
import { useEffect, useState, useContext } from 'react';
import { VehicleTypeContext } from '../../context/VehicleTypeContext';
import Card from './card';
import '../../vehicleForm.css';

export default function VehicleTable() {
    const [vehicles, setVehicles] = useState([]);
    const [serverErrors, setServerErrors] = useState({});
    const { vehicleTypes } = useContext(VehicleTypeContext);

    const handleDelete = deletedVehicleId => {
        setVehicles(vehicles.filter(vehicle => vehicle._id !== deletedVehicleId));
    };

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get('http://localhost:3100/api/vehicles', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setVehicles(response.data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    const navigate = useNavigate();

    const sweetAlertFunc = () => {
        Swal.fire({
            title: "Vehicle Data",
            text: "Vehicle Data Added Successfully",
            icon: "success",
            confirmButtonText: "OK"
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/supplier-dashboard");
            }
        });
    };

    const initialValues = {
        vehicleNumber: '',
        vehicleTypeId: ''
    };

    const vehicleValidationSchema = Yup.object({
        vehicleNumber: Yup.string()
            .required('Vehicle number is required'),
        vehicleTypeId: Yup.string()
            .required('Vehicle type is required')
    });

    return (
        <>
            <div className="vehicle-form-container">
                <h2>Add Vehicle</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={vehicleValidationSchema}
                    onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
                        try {
                            setServerErrors({});
                            const response = await axios.post('http://localhost:3100/api/vehicles', values, {
                                headers: {
                                    Authorization: localStorage.getItem('token')
                                }
                            });
                            console.log('Vehicle added successfully:', response.data);
                            setVehicles([...vehicles, response.data]);
                            resetForm();
                            sweetAlertFunc();
                        } catch (error) {
                            console.error('Error adding vehicle:', error);
                            if (error.response && error.response.data && error.response.data.errors) {
                                console.log('Server validation errors:', error.response.data.errors);
                                setServerErrors(error.response.data.errors);
                                setErrors(error.response.data.errors);  // Set Formik field errors
                            }
                        }
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className='select-wrapper'>
                                <label htmlFor="vehicleType">Vehicle Type</label>
                                <Field as="select" name="vehicleTypeId">
                                    <option value="">Select Vehicle Type</option>
                                    {vehicleTypes.data.map((type) => (
                                        <option key={type._id} value={type._id}>{type.name}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="vehicleTypeId" component="div" className="error-message" />
                            </div>
                            <div>
                                <label htmlFor="vehicleNumber">Vehicle Number</label>
                                <Field type="text" name="vehicleNumber" />
                                <ErrorMessage name="vehicleNumber" component="div" className="error-message" />
                                {serverErrors.length>0 && (
                                    <Alert variant="danger">
                                        {serverErrors.map((error, index) => (
                                            <p key={index}>{error.msg}</p>
                                        ))}
                                    </Alert>
                                )}
                            </div>
                            <Button type="submit" disabled={isSubmitting}>Submit</Button>
                        </Form>
                    )}
                </Formik>
            </div>

            <h4><b>VEHICLE DETAILS : </b></h4>
            {vehicles.length === 0 ? (
                <p><b>No vehicle details to display. Please add vehicle details.</b></p>
            ) : (
                <div className="card-container">
                    {vehicles.map(vehicle => (
                        <Card key={vehicle._id} vehicle={vehicle} vehicleTypes={vehicleTypes.data} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </>
    );
}
