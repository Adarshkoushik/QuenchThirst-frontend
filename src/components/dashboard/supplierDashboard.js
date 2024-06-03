import { useState,useEffect } from "react"
import axios from "axios"
import VehicleForm from "../pages/vehicleForm";
import SupplierDetailsForm from "../pages/multiStepForm/supplierDetailsForm";
import VehicleTable from "../pages/vehicleTable"
//import img from "../../img/truck.jpeg"

export default function SupplierDashboard(){
    const [supplierData,setSupplierData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        (async()=>{
            try{
                const response = await axios.get('http://localhost:3100/api/suppliers/account',{
                headers : {
                    Authorization : localStorage.getItem('token')
                }
            })
            console.log(response.data)
            setSupplierData(response.data)
            }catch(error){
                console.log(error)
            } finally{
                setLoading(false);
            }
        })()
    },[])

    return (
        
        <div style={{backgroundColor : "#d3d3d3",width: "100vw",height: "100vh"}}>   
            {loading ? (
                <p>Loading...</p>
            ) : supplierData ? (
                <>
                    {/* <VehicleForm /><br /> */}
                    <VehicleTable /> 
                </>
                
            ) : (
                <SupplierDetailsForm />
            )}
        </div>
    )
}