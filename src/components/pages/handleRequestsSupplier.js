import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setServerErrors, startGetMyRequests } from "../../actions/request-action"
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { startAcceptRequest,startRejectRequest } from "../../actions/request-action";
import { useAuth } from "../../context/AuthContext";
import login from '../../img/login.jpg'

export default function HandleRequests() {
    const [page, setPage]=useState(1)
    const [limit, setLimit]=useState(5||10)
    const [orderTypeSearch, setOrderTypeSearch]=useState('')
    const [purposeSearch, setPurposeSearch]=useState('')
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()

    const {user} = useAuth()

    const requests = useSelector((state) => {
        return state.requests
    })
    console.log("data...-",requests.data)
    
    useEffect(()=>{
        setLoading(true)
        dispatch(startGetMyRequests(page,limit,orderTypeSearch,purposeSearch))  
    },[page,limit,orderTypeSearch,purposeSearch])

    useEffect(() => {
        return () => {
            dispatch(setServerErrors([]))
        }
    }, [])

    const [id, setId] = useState('')
    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal)
        dispatch(setServerErrors([]))
    }

    const handleNextPage = () => {
        if (page < requests.totalPages) {
            setPage(page + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleAccept = (id) => {
        dispatch(startAcceptRequest(id))
        toggle()
    }
    const handleReject = (id) => {
        const confirm = window.confirm("Are you sure?")
        if(confirm){
            dispatch(startRejectRequest(id))
            toggle()
        } 
    }


    console.log(user, 'user')
    const data = requests.data.filter((ele)=>{
        for(let i =0; i <ele.suppliers.length;i++){
            if(ele.suppliers[i]['supplierId'] === user._id){
                return true
            }
        }
    })
    // console.log(data, 'data-after-filter')
    
    return (
        <>
            <div className="container mt-4" style={{ backgroundImage: `url(${login})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} >
            <h3>Request Details</h3>
            {/* {data.length === 0 ? ( */}
            <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label><b>Order-Type:</b></label>
                            <input
                                type="text" 
                                placeholder="search order-type...."
                                className="form-control"
                                value={orderTypeSearch} 
                                onChange={(e)=>setOrderTypeSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label><b>Purpose:</b></label>
                            <input
                                type='text' 
                                placeholder="search purpose...."
                                className="form-control"
                                value={purposeSearch}
                                onChange={(e)=>setPurposeSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* {requests.length===0 ? ( */}
            {/* {requests.data.length === 0  ? ( */}
            {requests?.data?.filter((request) => request.status === 'pending' && (!orderTypeSearch || request.orderType.toLowerCase().includes(orderTypeSearch.toLowerCase())) && (!purposeSearch || request.purpose.toLowerCase().includes(purposeSearch.toLowerCase()))).length === 0 ? (
                <p><b>THERE IS NO REQUEST DATA TO DISPLAY FOR THIS SUPPLIER</b></p>
            ) : (
                <>
                    <table className="table">
                    <thead>
                        <tr>
                            <th>vehicleType</th>
                            <th>orderType</th>
                            <th>orderDate</th>
                            <th>Quantity</th>
                            <th>Purpose</th>
                            {/* <th>CustomerAddress</th> */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter((request) => { return request.status === 'pending' }).length === 0 ?
                            <p><br /><b>No Request data to display</b></p> :
                            data.filter((request) => { return request.status === 'pending' }).map((ele) => {
                                const formattedDate = new Date(ele.orderDate).toISOString().split('T')[0];
                                return (
                                    <tr key={ele._id}>
                                        <td>{ ele.vehicleTypeId?.name }</td>
                                        <td>{ele.orderType}</td>
                                        <td>{formattedDate}</td>
                                        <td>{ele.quantity}</td>
                                        <td>{ele.purpose}</td>
                                        {/* <td>{ ele.customerAddress }</td> */}
                                        <td><button onClick={() => {
                                            setId(ele._id)
                                            toggle()
                                        }}>show</button>
                                            {/* <button onClick={() => {
                                            handleEdit(ele._id)
                                        }}>edit</button> */}
                                            {/* <button onClick={() => {
                                            handleRemove(ele._id)
                                        }}>remove</button> */}
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
                <nav aria-label="Page navigation example ">
                        <ul className="pagination d-flex justify-content-end">
                            <li className={`page-item`}>
                                <button className="page-link" onClick={handlePrevPage}>Previous</button>
                            </li>
                            <li className="page-item disabled"><span className="page-link">{page}</span></li>
                            <li className={`page-item`}>
                                <button className="page-link" onClick={handleNextPage} disabled={page===requests.totalPages}>Next</button>
                            </li>
                        </ul>
                    </nav>
                </>
            )}

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Request</ModalHeader>
                <ModalBody>
                    <ul>
                        {id && <>
                            {requests.data.filter((ele) => {
                                return ele._id === id
                            }).map((requestDetails) => {
                                const formattedDate = new Date(requestDetails.orderDate).toISOString().split('T')[0];
                                return <div key={requestDetails._id}>
                                    <p><b>VehicleType : </b> {requestDetails.vehicleTypeId?.name}</p>
                                    <p><b>OrderType : </b> {requestDetails.orderType}</p>
                                    <p><b>Order Date : </b> {formattedDate}</p>
                                    <p><b>Quantity : </b> {requestDetails.quantity}</p>
                                    <p><b>Purpose : </b> {requestDetails.purpose}</p>
                                    <p><b>Address : </b> {requestDetails.customerAddress}</p><br />
                                    <Button color="success" onClick={() => { handleAccept(requestDetails._id) }}>
                                        Accept
                                    </Button>{' '}
                                    <Button color="danger" className="ml-4" onClick={() => { handleReject(requestDetails._id) }}>
                                        Reject
                                    </Button>{' '}
                                </div>
                            })}
                        </>}
                    </ul>
                </ModalBody>
            </Modal>
            
        </>
    )
}