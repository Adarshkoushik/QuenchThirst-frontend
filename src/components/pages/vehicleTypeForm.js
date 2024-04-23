import React, {useState} from 'react';
import { Formik, FieldArray, Form, Field, ErrorMessage } from 'formik';
import '../../style.css'
import * as Yup from 'yup';
import axios from 'axios';
import { Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

export default function VehicleTypeForm(){

    const [serverErrors, setServerErrors] = useState([]);
    const [selectedPurposes, setSelectedPurposes] = useState({});

    const initialValues = {
        name: '',
        capacity: '',
        prices: [
            { purpose: 'domestic', price: '' },
            { purpose: 'commercial', price: '' },
            { purpose: 'construction', price: '' },
            { purpose: 'priority', price: '' }
        ]
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        capacity: Yup.string().required('Capacity is required'),
        prices: Yup.array().of(
            Yup.object().shape({
                purpose: Yup.string().required('Purpose is required'),
                price: Yup.number().required('Price is required').positive('Price must be a positive number')
            })
        )
    });

    const handleSubmit = async (values, {resetForm}) => {
        try {
            // app.post('/api/vehicleType',authenticateUser,authorizeUser(['admin']),checkSchema(vehicleTypeValidation),vehicleTypeController.create)
            const response = await axios.post('http://localhost:3100/api/vehicleType', values,{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            });
            console.log(response.data);
            resetForm()
            // Handle success
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    const helperFunction = (name) => {
        return serverErrors
          .filter((ele) => ele.path === name)
          .map((ele, i) => {
            return <li key={i}>{ele.msg}</li>;
          });
      };

    return (
        <div>
            <h3><i>Add Vehicle Type:</i></h3>
            <Formik
                initialValues={initialValues}
        
        validationSchema={Yup.object({
          name: Yup.string()
            .max(25, 'Must be 25 characters or less')
            .required('Required')
            .oneOf(['tractor','tipper','lorry'],'vehicles should be one amongst the options'),
          capacity: Yup.string()
            .max(30, 'Must be 30 characters or less')
            .required('Required')
            .oneOf(['6000','8000','12000'],'capacity should be 6000L, 8000L, or 12000L'),
          prices: Yup.array().of(
            Yup.object().shape({
                purpose:Yup.string()
                    .required('Purpose is required')
                    .oneOf(['domestic','commercial','construction','priority'],'purpose should be amongst the options')
                    .test('unique-purpose', 'Purpose already exists for this vehicle', function(value) {
                        const vehicleName = this.parent.name;
                        return !selectedPurposes[vehicleName] || !selectedPurposes[vehicleName].includes(value);
                    }),
                price:Yup.string().required('Price is required')
            })
          )
        })}

        onSubmit={handleSubmit}
        
      >
        {(formikProps) => (
          <Form className="form-control">
            <div>
              
              <FormGroup controlId="name">
                <FormLabel>Vehicle Name</FormLabel>
                <Field
                    as="select"
                    name="name"
                    className="form-control"
                    onChange={(e)=>{ 
                        const selectedName = e.target.value;
                        let selectedCapacity = '';
                        if (selectedName === 'tractor') {
                            selectedCapacity = '6000';
                        } else if (selectedName === 'tipper') {
                            selectedCapacity = '8000';
                        } else if (selectedName === 'lorry') {
                            selectedCapacity = '12000';
                        }
                        formikProps.setValues({ ...formikProps.values, name: selectedName, capacity: selectedCapacity });
                    }}
                >
                    <option value=''>Select Vehicle Name</option>
                    <option value="tractor">Tractor</option>
                    <option value="tipper">Tipper</option>
                    <option value="lorry">Lorry</option>
                </Field>
                <ErrorMessage className="text-danger" component="div" name="name" />
                  {formikProps.values.name.length === 0 && (
                    <p style={{ color: 'red' }}>{helperFunction('name')}</p>
                  )}
              </FormGroup>
              
              <FormGroup controlId="capacity">
                <FormLabel>Capacity</FormLabel>
                <Field
                    as="select"
                    name="capacity"
                    className='form-control'    
                    onChange={(e)=>{ 
                        const selectedCapacity = e.target.value;
                        let selectedName = '';
                        if (selectedCapacity === '6000') {
                            selectedName = 'tractor';
                        } else if (selectedCapacity === '8000') {
                            selectedName = 'tipper';
                        } else if (selectedCapacity === '12000') {
                            selectedName = 'lorry';
                        }
                        formikProps.setValues({ ...formikProps.values, name: selectedName, capacity: selectedCapacity });
                    }}
                >
                    <option value=''>Select capacity</option>
                    <option value="6000">6000L</option>
                    <option value="8000">8000L</option>
                    <option value="12000">12000L</option>
                </Field>
                <ErrorMessage className="text-danger" component="div" name="capacity" />
                {formikProps.values.capacity.length === 0 && (
                  <p style={{ color: 'red' }}>{helperFunction('capacity')}</p>
                )}
              </FormGroup>
            <FieldArray name="prices">
            {({ push, remove }) => (
            <div>
                {formikProps.values.prices.map((price, index) => (
                    <div key={index}>
                        <FormGroup>
                            <FormLabel>{price.purpose.charAt(0).toUpperCase() + price.purpose.slice(1)}</FormLabel>
                            <Field
                                name={`prices.${index}.price`}
                                type="number"
                                className='form-control'
                                placeholder={`Enter price for ${price.purpose}`}
                            />
                            <ErrorMessage name={`prices.${index}.price`} component="div" className="error-message" />
                        </FormGroup>
                        
                    </div>
                ))}
                <br/>
                
            </div>
            )}
            </FieldArray>

                
              {/* <FormGroup>
                
                <button type="button" onClick={() => formikProps.prices.push({ purpose: '', price: '' })}>Add Price</button>
                </FormGroup>
                <br/> */}


            </div>
            <br/>
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


// {formikProps.values.prices.map((price, index) => (
    // <div key={index}>
        // <label htmlFor={`prices.${index}.purpose`}>Purpose:</label><br />
        // {/* <Field type="text" id={`prices.${index}.purpose`} name={`prices.${index}.purpose`} /> */}
        // <Field
            // as="select"
            // name={`prices[${index}].purpose`}
            // className='form-control'    
        // >
        //     <option value=''>Select Purpose</option>
        //     <option value="domestic">Domestic</option>
        //     <option value="commercial">Commercial</option>
        //     <option value="construction">Construction</option>
        //     <option value="priority">Priority</option>
        // </Field>
        // <ErrorMessage name={`prices.${index}.purpose`} component="div" className="error-message" /><br />
        // <label htmlFor={`prices.${index}.price`}>Price:</label><br />
        // <Field type="number" id={`prices.${index}.price`} name={`prices.${index}.price`} />
        // <ErrorMessage name={`prices.${index}.price`} component="div" className="error-message" />
//     </div>
// ))}