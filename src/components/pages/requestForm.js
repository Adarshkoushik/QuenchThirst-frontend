import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { startCreateRequest } from '../../actions/request-action';
import { VehicleTypeContext } from '../../context/VehicleTypeContext';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2"

export default function RequestForm() {
    //const {user} = useAuth()
    //const [radius, setRadius] = useState(10);
    const { vehicleTypes } = useContext(VehicleTypeContext)
    const serverErrors = useSelector((state) => {
        return state.requests.serverErrors
    })

    const navigate = useNavigate()

    const sweetAlertFunc = () => {
        Swal.fire({
            title: "Request",
            text: "Request Added Successful",
            icon: "success",
            confirmButtonText: "OK"
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/customer-dashboard")
            }
        })
    }

    const dispatch = useDispatch()

    // State variables to manage form data
    const [formData, setFormData] = useState({
        vehicleTypeId: '',
        customerAddress: '',
        orderType: 'immediate', // Default value set to 'immediate'
        quantity: '',
        orderDate: new Date().toISOString().split('T')[0], // Set initial orderDate to today's date
        purpose: ''
    });

    // Handler for input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        // If orderType is immediate, set orderDate to today's date
        if (name === 'orderType' && value === 'immediate') {
            setFormData({ ...formData, orderType: value, orderDate: new Date().toISOString().split('T')[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const resetForm = () => {
            setFormData({
                vehicleTypeId: '',
                customerAddress: '',
                orderType: 'immediate',
                quantity: '',
                orderDate: new Date().toISOString().split('T')[0],
                purpose: ''
            })
        }
        // Dispatch action to create request
        dispatch(startCreateRequest(formData, resetForm));

        sweetAlertFunc()
        // Clear form fields after submission
        setFormData({
            vehicleTypeId: '',
            orderType: '',
            quantity: '',
            orderDate: '',
            purpose: ''
        })
    }

    return (
        <>
            {
                serverErrors?.length > 0 && (
                    <div>
                        These errors prohibited the form from being saved:
                        <ul>
                            {serverErrors.map((ele, i) => {
                                return <li key={i}> {ele.msg}</li>
                            })}
                        </ul>
                    </div>
                )
            }

            <form onSubmit={handleSubmit}>
                <div className='requestForm'>
                    <label htmlFor="vehicleTypeId">Vehicle Type Name : </label>{" "}
                    <select
                        value={formData.vehicleTypeId}
                        onChange={handleChange}
                        name='vehicleTypeId'
                        id='vehicleTypeId'
                    >
                    <option value=''>Select VehicleType</option>
                    {vehicleTypes.data.map((ele) => {
                        return (
                            <option
                                key={ele._id}
                                value={ele._id}>{ele.name}</option>
                        )
                    })}
                    </select>

                    <div>
                        <label>Order Type : </label>{" "}
                        <label>
                            <input
                                type="radio"
                                name="orderType"
                                value="immediate"
                                checked={formData.orderType === 'immediate'}
                                onChange={handleChange}
                            />
                            Immediate
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="orderType"
                                value="advance"
                                checked={formData.orderType === 'advance'}
                                onChange={handleChange}
                            />
                            Advance
                        </label>
                    </div>

                    <div>
                        <label htmlFor="quantity">Quantity : </label>{" "}
                        <input
                            type="text"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                    </div>
                    {formData.orderType === 'immediate' ? (
                        <div>
                            <label>Order Date (Immediate) : </label>{" "}
                            <input
                                type="text"
                                value={formData.orderDate}
                                disabled
                            />
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="orderDate">Order Date (Advance) : </label>{" "}
                            <input
                                type="date"
                                id="orderDate"
                                name="orderDate"
                                value={formData.orderDate}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <label htmlFor="purpose">Purpose : </label>{" "}
                    <select
                        id="purpose"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                    >
                        <option value="">Select Purpose</option>
                        <option value="domestic">Domestic</option>
                        <option value="commercial">Commercial</option>
                        <option value="construction">Construction</option>
                        <option value="priority">Priority</option>
                    </select><br />
                    <button type="submit">Submit</button>
                </div>
            </form>
        </>
    )

}