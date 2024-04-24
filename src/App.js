import { Routes, Route, Link } from 'react-router-dom'
import { useEffect } from 'react';
import axios from 'axios';
import LoginForm from './components/registrationAndLogin/loginForm';
import Account from './components/pages/account';
import PrivateRoute from './components/pages/privateRoute';
import RoleBasedRedirect from './components/dashboard/roleBasedRedirect';
import RegisterForm from './components/registrationAndLogin/registerForm';
import 'bootstrap/dist/css/bootstrap.min.css';
//import VehicleTypeForm from './components/pages/vehicleTypeForm';
import { useAuth } from './context/AuthContext';
import Unauthorized from './components/pages/unauthorized';
import OtpVerification from './components/registrationAndLogin/otpVerification';
import ForgotPassword from './components/registrationAndLogin/forgotPassword';
import SupplierDashboard from './components/dashboard/supplierDashboard';
import ShowPriceDetails from './components/pages/showPriceDetails';


function App() {
  const { user, handleLogin, handleLogout } = useAuth()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      (async () => {
        const response = await axios.get('http://localhost:3100/api/users/account', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        handleLogin(response.data)
      })()
    }
  }, [])

  return (

    <div className="App">

      <h1>QT APP</h1>
      {!user ? (
        <>
          <Link to="/register">Register</Link> |
          <Link to="/"> Login </Link> |
        </>
      ) : (
        <>
          <Link to="/account">Account</Link> |
          <Link to="/" onClick={() => {
            localStorage.removeItem('token')
            handleLogout()
          }}> Logout </Link> |
          {(user.role === 'supplier' || user.role === 'admin') && (
            <Link to="/price-details" element={<ShowPriceDetails />}>Price Details</Link>
          )}
        </>
      )}

      

      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path='/login-success' element={<RoleBasedRedirect />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path='/emailVerification' element={<OtpVerification />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/supplier-dashboard' element={<SupplierDashboard />} />
        <Route path="/account" element={
          <PrivateRoute permittedRoles={['admin', 'customer', 'supplier']}>
            <Account />
          </PrivateRoute>
        } />
        {/* <Route path='/vehicle-type' element={<VehicleTypeForm />} /> */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </div>
  );
}

export default App;
