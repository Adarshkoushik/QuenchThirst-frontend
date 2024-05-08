import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Multistep from 'react-multistep';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AddressDetailsForm from './addressDetails';
import BankAccountDetails from './bankDetails';

export default function SupplierDetailsForm() {
  const [serverErrors, setServerErrors] = useState([]);
  const navigate = useNavigate()
  const initialValues = {
    building: '',
    locality: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    licenseNumber: '',
    accHolderName: '',
    bank: '',
    accNum: '',
    IFSC: '',
    branch: ''
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:3100/api/suppliers', values, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      console.log(response.data);
      navigate('/supplier-dashboard')
    } catch (err) {
      console.log(err);
      setServerErrors(err.response.data.errors);
    }
  };

  // const helperFunction = (name) => {
  //   return serverErrors
  //     .filter((ele) => ele.path === name)
  //     .map((ele, i) => {
  //       return <li key={i}>{ele.msg}</li>;
  //     });
  // };

  const steps = [
    { name: 'Address Details', component: <AddressDetailsForm /> },
    { name: 'Bank Account Details', component: <BankAccountDetails /> }
  ];

  return (
    <div>
      <h2>Suppliers Details Form :</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          building: Yup.string().max(60, 'Must be 40 characters or less').required('Required'),
          locality: Yup.string().max(30, 'Must be 30 characters or less').required('Required'),
          city: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
          state: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
          pinCode: Yup.number().max(999999, 'Must be 6 digits').required('Required'),
          country: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
          licenseNumber: Yup.string().max(20, 'Must be 20 characters or less').required('Required'),
          accHolderName: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
          bank: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
          accNum: Yup.string().max(20, 'Must be 20 characters or less').required('Required'),
          IFSC: Yup.string().max(10, 'Must be 10 characters or less').required('Required'),
          branch: Yup.string().max(15, 'Must be 15 characters or less').required('Required')
        })}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <Form>
            <Multistep showNavigation={true} steps={steps} /><br />
            <Button type="submit">Submit</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

