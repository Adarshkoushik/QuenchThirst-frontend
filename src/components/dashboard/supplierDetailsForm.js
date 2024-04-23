import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

export default function SupplierDetailsForm() {
  const [serverErrors, setServerErrors] = useState([]);
  const navigate = useNavigate()

  const initialValues={
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
  }

  const handleSubmit=async (values)=>{
    try{
      const response = await axios.post('http://localhost:3100/api/suppliers', values,{
        headers: {
            Authorization: localStorage.getItem('token')
        }
    });
      console.log(response.data);
      navigate('/supplier-dashboard')
    }catch(err){
      console.log(err);
      setServerErrors(err.response.data.errors);
    }
  }

  const helperFunction = (name) => {
    return serverErrors
      .filter((ele) => ele.path === name)
      .map((ele, i) => {
        return <li key={i}>{ele.msg}</li>;
      });
  };

  return (
    <div>
      <h2>Suppliers Details</h2>
      <Formik
        initialValues={initialValues}
        
        validationSchema={Yup.object({
          building: Yup.string()
            .max(25, 'Must be 25 characters or less')
            .required('Required'),
          locality: Yup.string()
            .max(30, 'Must be 30 characters or less')
            .required('Required'),
          city: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .required('Required'),
          state: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .required('Required'),
          pinCode: Yup.number()
            .max(999999, 'Must be 6 digits')
            .required('Required'),
          country: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .required('Required'),
          licenseNumber: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
          // bankAcc: Yup.object().shape({
            accHolderName: Yup.string()
              .max(15, 'Must be 15 characters or less')
              .required('Required'),
            bank: Yup.string()
              .max(15, 'Must be 15 characters or less')
              .required('Required'),
            accNum: Yup.string()
              .max(20, 'Must be 20 characters or less')
              .required('Required'),
            IFSC: Yup.string()
              .max(10, 'Must be 10 characters or less')
              .required('Required'),
            branch: Yup.string()
              .max(15, 'Must be 15 characters or less')
              .required('Required')
          // })
        })}

        onSubmit={handleSubmit}
        
      >
        {(formikProps) => (
          <Form className="form-control">
            <div>
              <h3>Address Details-</h3>
              <FormGroup controlId="building">
                <FormLabel>Door No.</FormLabel>
                <Field
                    type="text"
                    name="building"
                    placeholder="Enter building no. & name"
                    as={FormControl}
                />
                <ErrorMessage className="text-danger" component="div" name="building" />
                  {formikProps.values.building.length === 0 && (
                    <p style={{ color: 'red' }}>{helperFunction('building')}</p>
                  )}
              </FormGroup><br />
              {/* <label className="form-label" htmlFor="building">
                Door No.
              </label>
              <Field className="form-control" name="building" type="text" id="building" />
              <ErrorMessage className="text-danger" component="div" name="building" />
              {formikProps.values.building.length === 0 && (
                <p style={{ color: 'red' }}>{helperFunction('building')}</p>
              )} */}

              <FormGroup controlId="locality">
                <FormLabel>Locality</FormLabel>
                <Field
                    type="text"
                    name="locality"
                    placeholder="Enter your Locality"
                    as={FormControl}
                />
                <ErrorMessage className="text-danger" component="div" name="locality" />
                {formikProps.values.locality.length === 0 && (
                  <p style={{ color: 'red' }}>{helperFunction('locality')}</p>
                )}
              </FormGroup><br />

              {/* <label className="form-label" htmlFor="locality">
                Locality
              </label>
              <Field className="form-control" name="locality" type="text" id="locality" />
              

              <label className="form-label" htmlFor="city">
                City
              </label>
              <Field className="form-control" name="city" type="text" id="city" />
              <ErrorMessage className="text-danger" component="div" name="city" />
              {formikProps.values.city.length === 0 && <p style={{ color: 'red' }}>{helperFunction('city')}</p>} */}

              <FormGroup controlId="city">
                  <FormLabel>City</FormLabel>
                  <Field
                      type="text"
                      name="city"
                      placeholder="Enter your City"
                      as={FormControl}
                  />
                  <ErrorMessage className="text-danger" component="div" name="city" />
                  {formikProps.values.city.length === 0 && (
                    <p style={{ color: 'red' }}>{helperFunction('city')}</p>
                  )}
              </FormGroup><br />

              <FormGroup controlId="state">
                  <FormLabel>State</FormLabel>
                  <Field
                      type="text"
                      name="state"
                      placeholder="Enter your state"
                      as={FormControl}
                  />
                  <ErrorMessage className="text-danger" component="div" name="state" />
                  {formikProps.values.state.length === 0 && (
                    <p style={{ color: 'red' }}>{helperFunction('state')}</p>
                  )}
              </FormGroup><br />
              
              {/* <label className="form-label" htmlFor="state">
                State
              </label>
              <Field className="form-control" name="state" type="text" id="state" />
              <ErrorMessage className="text-danger" component="div" name="state" />
              {formikProps.values.state.length === 0 && <p style={{ color: 'red' }}>{helperFunction('state')}</p>} */}

              <FormGroup controlId="pinCode">
                  <FormLabel>Pincode</FormLabel>
                  <Field
                      type="text"
                      name="pinCode"
                      placeholder="Enter your pinCode"
                      as={FormControl}
                  />
                  <ErrorMessage className="text-danger" component="div" name="pinCode" />
                  {formikProps.values.pinCode.length === 0 && (
                    <p style={{ color: 'red' }}>{helperFunction('pinCode')}</p>
                  )}
              </FormGroup><br />

              {/* <label className="form-label" htmlFor="pinCode">
                Pincode
              </label>
              <Field className="form-control" name="pinCode" type="text" id="pinCode" />
              <ErrorMessage className="text-danger" component="div" name="pinCode" />
              {serverErrors.length > 0 && <p style={{ color: 'red' }}>{helperFunction('pinCode')}</p>} */}

              <FormGroup controlId="country">
                  <FormLabel>Country</FormLabel>
                  <Field
                      type="text"
                      name="country"
                      placeholder="Enter your country"
                      as={FormControl}
                  />
                  <ErrorMessage className="text-danger" component="div" name="country" />
                  {formikProps.values.country.length === 0 && (
                    <p style={{ color: 'red' }}>{helperFunction('country')}</p>
                  )}
              </FormGroup><br />
              {/* <label className="form-label" htmlFor="country">
                Country
              </label>
              <Field className="form-control" name="country" type="text" id="country" />
              <ErrorMessage className="text-danger" component="div" name="country" />
              {formikProps.values.country.length === 0 && (
                <p style={{ color: 'red' }}>{helperFunction('country')}</p>
              )} */}

              <FormGroup controlId="licenseNumber">
                  <FormLabel>Business License Number</FormLabel>
                  <Field
                      type="text"
                      name="licenseNumber"
                      placeholder="Enter Business License Number "
                      as={FormControl}
                  />
                  <ErrorMessage className="text-danger" component="div" name="licenseNumber" />
                  {formikProps.values.licenseNumber.length === 0 && (
                    <p style={{ color: 'red' }}>{helperFunction('licenseNumber')}</p>
                  )}
              </FormGroup><br />
              {/* <label className="form-label" htmlFor="licenseNumber">
                Business License Number
              </label>
              <Field className="form-control" name="licenseNumber" type="text" id="licenseNumber" />
              <ErrorMessage className="text-danger" component="div" name="licenseNumber" />
              {formikProps.values.licenseNumber.length === 0 && (
                <p style={{ color: 'red' }}>{helperFunction('licenseNumber')}</p>
              )} */}
            
              <h3>Bank Account Details-</h3>
              <FormGroup controlId="accHolderName">
                  <FormLabel>Account Holder Name</FormLabel>
                  <Field
                      type="text"
                      name="accHolderName"
                      placeholder="Enter Account Holder Name "
                      as={FormControl}
                  />
                  <ErrorMessage className="text-danger" component="div" name="accHolderName" />
                  {formikProps.values.accHolderName.length === 0 && (
                    <p style={{ color: 'red' }}>{helperFunction('accHolderName')}</p>
                  )}
              </FormGroup><br />
              {/* <label className="form-label" htmlFor="accHolderName">
                Account Holder Name
              </label>
              <Field className="form-control" name="accHolderName" type="text" id="accHolderName" />
              <ErrorMessage className="text-danger" component="div" name="accHolderName" />
              {formikProps.values.accHolderName && formikProps.values.accHolderName.length === 0 && (
                <p style={{ color: 'red' }}>{helperFunction('accHolderName')}</p>
              )} */}

              <FormGroup controlId="bank">
                  <FormLabel>Bank Name</FormLabel>
                  <Field
                      type="text"
                      name="bank"
                      placeholder="Enter Bank Name "
                      as={FormControl}
                  />
                  <ErrorMessage className="text-danger" component="div" name="bank" />
                  {formikProps.values.bank.length === 0 && (
                    <p style={{ color: 'red' }}>{helperFunction('bank')}</p>
                  )}
              </FormGroup><br />

              {/* <label className="form-label" htmlFor="bank">
                Bank Name
              </label>
              <Field className="form-control" name="bank" type="text" id="bank" />
              <ErrorMessage className="text-danger" component="div" name="bank" />
              {formikProps.values.bank && formikProps.values.bank.length === 0 && (
                <p style={{ color: 'red' }}>{helperFunction('bank')}</p>
              )} */}

              <FormGroup controlId="accNum">
                  <FormLabel>Account Number</FormLabel>
                  <Field
                      type="text"
                      name="accNum"
                      placeholder="Enter Account Number"
                      as={FormControl}
                  />
                  <ErrorMessage className="text-danger" component="div" name="accNum" />
                  {formikProps.values.accNum.length === 0 && (
                    <p style={{ color: 'red' }}>{helperFunction('accNum')}</p>
                  )}
              </FormGroup><br />

              {/* <label className="form-label" htmlFor="accNum">
                Account Number
              </label>
              <Field className="form-control" name="accNum" type="text" id="accNum" />
              <ErrorMessage className="text-danger" component="div" name="accNum" />
              {formikProps.values.accNum && formikProps.values.accNum.length === 0 && (
                <p style={{ color: 'red' }}>{helperFunction('accNum')}</p>
              )} */}

              <FormGroup controlId="IFSC">
                  <FormLabel>IFSC</FormLabel>
                  <Field
                      type="text"
                      name="IFSC"
                      placeholder="Enter IFSC"
                      as={FormControl}
                  />
                  <ErrorMessage className="text-danger" component="div" name="IFSC" />
                  {formikProps.values.IFSC.length === 0 && (
                    <p style={{ color: 'red' }}>{helperFunction('IFSC')}</p>
                  )}
              </FormGroup><br />
              {/* <label className="form-label" htmlFor="IFSC">
                IFSC code
              </label>
              <Field className="form-control" name="IFSC" type="text" id="IFSC" />
              <ErrorMessage className="text-danger" component="div" name="IFSC" />
              {formikProps.values.IFSC && formikProps.values.IFSC.length === 0 && (
                <p style={{ color: 'red' }}>{helperFunction('IFSC')}</p>
              )} */}

              <FormGroup controlId="branch">
                  <FormLabel>Branch</FormLabel>
                  <Field
                      type="text"
                      name="branch"
                      placeholder="Enter Branch Name"
                      as={FormControl}
                  />
                  <ErrorMessage className="text-danger" component="div" name="branch" />
                  {formikProps.values.branch.length === 0 && (
                    <p style={{ color: 'red' }}>{helperFunction('branch')}</p>
                  )}
              </FormGroup><br />
              {/* <label className="form-label" htmlFor="branch">
                Branch
              </label>
              <Field className="form-control" name="branch" type="text" id="branch" />
              <ErrorMessage className="text-danger" component="div" name="branch" />
              {formikProps.values.branch && formikProps.values.branch.length === 0 && (
                <p style={{ color: 'red' }}>{helperFunction('branch')}</p>
              )} */}
            </div>
            <Button type="submit" className="btn btn-primary form-control">
              Submit
            </Button>{' '}
            <br />
          </Form>
        )}
      </Formik>
    </div>
  );
}