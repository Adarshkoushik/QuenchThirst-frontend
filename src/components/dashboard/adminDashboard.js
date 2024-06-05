import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import SuppliersTable from "../pages/suppliersTable"
import { Modal, ModalHeader, ModalBody } from "reactstrap";

export default function AdminDashboard(){
    const [suppliers, setSuppliers] = useState([])
    const [modal, setModal] = useState(false)
    const [id, setId] = useState("")

    const toggle = () => {
        setModal(!modal)
    }

    useEffect(()=>{
        (async()=>{
            const response = await axios.get('http://localhost:3100/api/suppliers',{
                headers : {
                    Authorization : localStorage.getItem('token')
                }
            })
            console.log("suppliers_list-", response.data)
            setSuppliers(response.data)
        })()
    },[])

    const handleShow = (supplierId) => {
        toggle()
        setId(supplierId)
    }
    
    const handleApprove = async (supplierId) => {
        try {
            const response = await axios.put(`http://localhost:3100/api/suppliers/${supplierId}/approve`,{},{
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
            {/* <h3>Suppliers List - {suppliers.length}</h3> */}
            <SuppliersTable suppliers={suppliers} handleShow={handleShow} handleApprove={handleApprove} handleRemove={handleRemove} />
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Supplier Detail</ModalHeader>
                <ModalBody>
                {suppliers.filter((ele)=>{
                    return ele._id === id
                }).map((supplierDetails)=>{
                    return<div key={supplierDetails._id}>
                            <p><b>Name : </b> {supplierDetails.userId.username}</p>
                            <p><b>Email : </b> {supplierDetails.userId.email}</p>
                            <p><b>License Number : </b> {supplierDetails.licenseNumber}</p>
                            <p><b>Account Number : </b> {supplierDetails.accNum}</p>
                            <p><b>IFSC : </b> {supplierDetails.IFSC}</p>
                            <p><b>Bank : </b> {supplierDetails.bank}</p>
                            <p><b>Branch : </b> {supplierDetails.branch}</p>
                            <p><b>Address : </b> {supplierDetails.building}, {supplierDetails.locality}, {supplierDetails.city}, {supplierDetails.state}, {supplierDetails.country} - {supplierDetails.pinCode}</p>
                        </div>
                })  
                    }
                </ModalBody>
            </Modal>
        </div>
    )
}