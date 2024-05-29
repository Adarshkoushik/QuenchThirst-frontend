import React, {useState,useContext} from 'react';
import { Formik, FieldArray, Form, Field, ErrorMessage } from 'formik';
import '../../style.css'
import * as Yup from 'yup';
import axios from 'axios';
import { Button, FormGroup, FormLabel } from 'react-bootstrap';
import { VehicleTypeContext } from '../../context/VehicleTypeContext';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";


export default function VehicleTypeForm(){

  const { vehicleTypeDispatch } = useContext(VehicleTypeContext);

    const [serverErrors, setServerErrors] = useState([]);
    const [selectedPurposes, setSelectedPurposes] = useState({});
    const navigate = useNavigate()
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

    const sweetAlertFunc = () => {
      Swal.fire({
          title: "VehicleType Price Details",
          text: "Price Detail Added Successfully",
          icon: "success",
          confirmButtonText: "OK"
      }).then((result) => {
          if (result.isConfirmed) {
              navigate("/price-details")
          }
      })
  }

    const handleSubmit = async (values, {resetForm}) => {
        try {
            const response = await axios.post('http://localhost:3100/api/vehicleType', values,{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            });
            console.log(response.data);
            vehicleTypeDispatch({type:"ADD_VEHICLE_TYPE",payload:response.data})
            sweetAlertFunc()
            resetForm()
        } catch (error) {
            console.error(error);
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
            .oneOf(['Tractor','Tipper','Lorry'],'vehicles should be one amongst the options'),
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
                        if (selectedName === 'Tractor') {
                            selectedCapacity = '6000';
                        } else if (selectedName === 'Tipper') {
                            selectedCapacity = '8000';
                        } else if (selectedName === 'Lorry') {
                            selectedCapacity = '12000';
                        }
                        formikProps.setValues({ ...formikProps.values, name: selectedName, capacity: selectedCapacity });
                    }}
                >
                    <option value=''>Select Vehicle Name</option>
                    <option value="Tractor">Tractor</option>
                    <option value="Tipper">Tipper</option>
                    <option value="Lorry">Lorry</option>
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
                            selectedName = 'Tractor';
                        } else if (selectedCapacity === '8000') {
                            selectedName = 'Tipper';
                        } else if (selectedCapacity === '12000') {
                            selectedName = 'Lorry';
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