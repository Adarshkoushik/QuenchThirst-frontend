import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import AdminDashboard from './adminDashboard';
import CustomerDashboard from './customerDashboard';
import SupplierDashboard from './supplierDashboard';


export default function RoleBasedRedirect(){
    const [userRole,setUserRole] = useState(null)
    const navigate = useNavigate()
    const token = localStorage.getItem('token')


    useEffect(()=>{
        if(token){
            const decodedToken = jwtDecode(token)
            const role = decodedToken.role
            setUserRole(role)
        }
    },[token])

    const renderDashboard = () => {
        switch (userRole) {
            case 'admin':
                return <AdminDashboard />

            case 'supplier':
                return <SupplierDashboard />
                
            case 'customer':
                return <CustomerDashboard />
            default:
                // Redirect to login page if role is not recognized or token is missing
                return navigate('/')
        }
    };

    return (
        <div>
            {userRole ? renderDashboard() : <p>Loading...</p>}
        </div>
    )
}