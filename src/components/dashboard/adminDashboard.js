import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import SuppliersTable from "../pages/suppliersTable"
import VehicleTypeForm from '../pages/vehicleTypeForm'

export default function AdminDashboard(){
    const [suppliers, setSuppliers] = useState([]);
    useEffect(()=>{
        (async()=>{
            const response = await axios.get('http://localhost:3100/api/suppliers',{
                headers : {
                    Authorization : localStorage.getItem('token')
                }
            })
            console.log(response.data)
            setSuppliers(response.data)
        })()
    },[])
    
    const handleApprove = async (supplierId) => {
        try {
            const response = await axios.put(`http://localhost:3100/api/suppliers/${supplierId}/approve`,{
                headers : {
                    Authorization : localStorage.getItem('token')
                }
            })
            setSuppliers(prevSuppliers => prevSuppliers.map(supplier => {
                if (supplier._id === supplierId) {
                    return { ...supplier, isApproved: true };
                }
                return supplier;
            }));
            console.log('Supplier approved successfully:', response.data);
        } catch (error) {
            console.error('Error approving supplier:', error);
        }
    }

    const handleRemove = async (supplierId) => {
        try {
            const confirmation = window.confirm('Are you sure you want to delete ?')
            if(confirmation){
                const response = await axios.delete(`http://localhost:3100/api/suppliers/${supplierId}`,{
                    headers : {
                        Authorization : localStorage.getItem('token')
                    }
                })
                setSuppliers(prevSuppliers => prevSuppliers.filter(supplier => supplier._id !== supplierId));
                console.log('Supplier removed successfully:', response.data);
            }
           
        } catch (error) {
            console.error('Error removing supplier:', error);
        }
    };
    return (
        <div>
            <h3>Admin Dashboard</h3>
            <h3><i>Suppliers List - {suppliers.length}</i></h3>
            <SuppliersTable suppliers={suppliers} handleApprove={handleApprove} handleRemove={handleRemove} />
            <h3><u>Vehicle Type form</u></h3>
            <VehicleTypeForm />
        </div>
    )
}