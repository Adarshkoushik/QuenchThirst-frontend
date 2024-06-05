import React, { useEffect, useReducer, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import LoginForm from './components/registrationAndLogin/loginForm'
import Account from './components/pages/account';
import PrivateRoute from './components/pages/privateRoute';
import RoleBasedRedirect from './components/dashboard/roleBasedRedirect';
import RegisterForm from './components/registrationAndLogin/registerForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import VehicleTypeForm from './components/pages/vehicleTypeForm';
import { useAuth } from './context/AuthContext';
import Unauthorized from './components/pages/unauthorized';
import OtpVerification from './components/registrationAndLogin/otpVerification';
import ForgotPassword from './components/registrationAndLogin/forgotPassword';
import SupplierDashboard from './components/dashboard/supplierDashboard';
import ShowPriceDetails from './components/pages/showPriceDetails';
import vehicleTypeReducer from './reducers/vehicleTypeReducer';
import RequestListForCustomer from './components/pages/requestsListCustomer';
import { VehicleTypeContext } from './context/VehicleTypeContext';
// import { startGetMyRequests } from './actions/request-action';
// import { startGetCustomerOrders, startGetSupplierOrders } from './actions/orders-action';
//import { useDispatch } from 'react-redux';
import Success from './components/pages/success';
import Failure from './components/pages/failure';
import Header from './headers/headers'
import OrdersListForCustomer from './components/pages/ordersListCustomer';
import HandleRequests from './components/pages/handleRequestsSupplier';
import OrdersListForSupplier from './components/pages/ordersListSupplier';
import CustomerDashboard from './components/dashboard/customerDashboard';
import AdminDashboard from './components/dashboard/adminDashboard';
import './style.css'
import CustomerPreviousOrders from './components/pages/customerPreviousOrders';
import SupplierPreviousOrders from './components/pages/supplierPreviousOrders';

function App() {
  //const dispatch = useDispatch();
  const { handleLogin, handleLogout } = useAuth();
  const [vehicleTypes, vehicleTypeDispatch] = useReducer(vehicleTypeReducer, { data: [], serverErrors: [] });
  const [login, setLogin] = useState(false);

  const handleSetLogin = () => {
    setLogin(!login);
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      (async () => {
        const response = await axios.get('http://localhost:3100/api/users/account', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        handleLogin(response.data);
        // if (response.data?.role === 'customer') {
        //   // dispatch(startGetRequests());
        //   //dispatch(startGetCustomerOrders());
        // }
        // if (response.data?.role === 'supplier') {
        //   //dispatch(startGetMyRequests());
        //   //dispatch(startGetSupplierOrders());
        // }
      })();
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const fetchVehicleTypes = async () => {
        try {
          const response = await axios.get('http://localhost:3100/api/vehicleType', {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          });
          console.log(response.data);
          vehicleTypeDispatch({ type: 'SET_VEHICLE_TYPE', payload: response.data });
        } catch (err) {
          console.log(err);
        }
      };
      fetchVehicleTypes();
    }
  }, [handleLogin]);

  return (
    <VehicleTypeContext.Provider value={{ vehicleTypes, vehicleTypeDispatch }}>
      <div className="App">
        <Header handleLogout={handleLogout} isAuthenticated={localStorage.getItem('token')} />
        <Routes>
          <Route path="/" element={<LoginForm setLogin={handleSetLogin} />} />
          <Route path="/login-success" element={<RoleBasedRedirect />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/emailVerification" element={<OtpVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
          <Route path='/customer-dashboard' element={<CustomerDashboard />} />
          <Route path="/add-vehicleType" element={<VehicleTypeForm />} />
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
          <Route
            path="/account"
            element={
              <PrivateRoute permittedRoles={['admin', 'customer', 'supplier']}>
                <Account />
              </PrivateRoute>
            }
          />
          <Route path="/price-details" element={<ShowPriceDetails />} />
          <Route path="/vehicle-type" element={<VehicleTypeForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/success" element={<Success />} />
          <Route path="/failure" element={<Failure />} />
          <Route path="/customer-requests" element={<RequestListForCustomer />} />
          <Route path='/customer-orders' element={<OrdersListForCustomer />} />
          <Route path='/customerPrevious-orders' element={<CustomerPreviousOrders />} />
          <Route path='/supplierPrevious-orders' element={<SupplierPreviousOrders />} />
          <Route path='/supplier-requests' element={<HandleRequests />} />
          <Route path="/supplier-orders" element={<OrdersListForSupplier />} />
         </Routes>
      </div>
    </VehicleTypeContext.Provider>
  );
}

export default App;
