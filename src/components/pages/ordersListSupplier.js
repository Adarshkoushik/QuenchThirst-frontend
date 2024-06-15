import React, { useEffect, useState } from "react"
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux"
import { setServerErrors, startGetSupplierOrders } from "../../actions/orders-action";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { MapContainer, TileLayer, Marker, Popup, LayerGroup, Polyline } from 'react-leaflet'
import { useAuth } from "../../context/AuthContext";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.module.css'

import { Icon } from "leaflet";
import pin from '../../img/pin.png'
import user1 from '../../img/user1.png'
import { startUpdateOrder } from "../../actions/orders-action";
import water2 from '../../img/water2.jpg'
import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import '../../map.css'

export default function OrdersListForSupplier() {
    const [selectedDate, setSelectedDate]= useState(null)
    const [suppliersCoordinate,setSuppliersCoordinate]=useState([])
    const [page, setPage]=useState(1)
    const [limit, setLimit]=useState(5||10)
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState('')
    const [modal, setModal] = useState(false);
    const dispatch = useDispatch()

    // const {user}=useAuth()
    // console.log("know_user-", user)

    const orders = useSelector((state) => {        
        return state.orders
    })
    console.log("orders-details-",orders)

    const orders_1=orders.data.map((ele)=>{
        return (ele.customerId.location)
    })
    console.log("orders-details-cust_location-",orders_1)

    useEffect(()=>{
        setLoading(true)
        dispatch(startGetSupplierOrders(page,limit))  
    },[page,limit])  
    
    const toggle = () => {
        setModal(!modal)
        dispatch(setServerErrors([]))
    }

    const customMarker = new Icon({
        iconUrl: pin,
        iconSize: [38, 38]
    })

    const supplierIcon = new Icon({
        iconUrl: user1,
        iconSize: [30, 30],
    })

    const handleNextPage = () => {
        if (page < orders.totalPages) {
            setPage(page + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    function reverseLatLon(arr) {
        return [arr[1], arr[0]]
      }  

    const createRoutineMachineLayer = () => {
        const cr= orders.data.find((ele)=>{
            return ele._id===id
        }).customerId?.location?.coordinates.reverse()
        console.log("coooooo--",cr)
        const instance = L.Routing.control({
          waypoints: [
            L.latLng(suppliersCoordinate),
            L.latLng(cr)
          ],
          lineOptions: {
            styles: [{ color: "red", weight: 4 }]
          },
          show: false,
          addWaypoints: false,
          routeWhileDragging: false,
          draggableWaypoints: false,
          fitSelectedRoutes: false,
          showAlternatives: true,
          createMarker: function () {
            return null;
          }
        });
      
        return instance;
      };

    
    const RoutingMachine = createControlComponent(createRoutineMachineLayer);

    
    useEffect(()=>{
        (async()=>{
            try{
                const response=await axios.get('http://localhost:3100/api/suppliers/account',{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            })
            console.log("supplier_name:", response.data)
            console.log("supplier_details_1:", response.data.location.coordinates)
            setSuppliersCoordinate(response.data.location.coordinates)
            }catch(err){
                console.log(err)
            }
        })();
    },[])    
  
    const handleChange=(date)=>{
        setSelectedDate(date)
    }

    const filteredOrders = orders.data.filter((ele) => {
        const orderDate = new Date(ele.orderDate);
        const selectedDateFormatted = selectedDate ? `${selectedDate.getDate()}-${selectedDate.getMonth() + 1}-${selectedDate.getFullYear()}` : null;
    
        const formattedOrderDate = `${orderDate.getDate()}-${orderDate.getMonth() + 1}-${orderDate.getFullYear()}`;
        // console.log("orderDate:", orderDate);
        // console.log("selectedDateFormatted:", selectedDateFormatted);
    
        return selectedDate ? formattedOrderDate === selectedDateFormatted : true;
    });

    useEffect(() => {
        return () => {
            dispatch(setServerErrors([]))
        }
    }, [])       

  
    const handleIsFullFilled = (orderId) => {
        dispatch(startUpdateOrder(orderId))
    }

    return (
        <>
            <div  style={{ backgroundImage: `url(${water2})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                <div className="container mt-4">
                    <h3>Orders Details</h3>
                    <DatePicker 
                        selected={selectedDate} 
                        onChange={handleChange}
                        placeholderText="Select Order-Date..." 
                    />
                    {filteredOrders.length === 0 ? (
                        <p><b>THERE IS NO ORDERS DATA TO DISPLAY FOR THIS SUPPLIER</b></p>
                    ) : (
                        <>
                            <table className="table">
                        <thead>
                            <tr>
                                <th>orderDate</th>
                                <th>Quantity</th>
                                <th>Purpose</th>
                                <th>orderType</th>
                                <th>isFulfilled</th>
                                <th>Payment Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((ele) => {
                                const formattedDate = ele.orderDate

                                return (
                                    <tr key={ele._id}>
                                        <td>{formattedDate}</td>
                                        {ele.lineItems.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <td>{item.quantity}</td>
                                                <td>{item.purpose}</td>
                                                <td>{item.orderType}</td>
                                            </React.Fragment>
                                        ))}
                                        <td>{ele.isFulfilled ? "Yes" : "No"}</td>
                                        <td>{ele.status}</td>
                                        <td>
                                            <button onClick={() => {
                                                setId(ele._id);
                                                toggle();
                                            }}>Show</button>{' '}
                                            {!ele.isFulfilled && !orders.data.some(order => order.orderDate === ele.orderDate && order.isFulfilled) && (
                                            <button onClick={() => handleIsFullFilled(ele._id)} disabled={!((ele.currentTokenNumber+1) === ele.tokenNumber)}>FulFilled</button>
                                        )}
                                        </td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                    <nav aria-label="Page navigation example ">
                        <ul className="pagination d-flex justify-content-end">
                            <li className={`page-item`}>
                                <button className="page-link" onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                            </li>
                            <li className="page-item disabled"><span className="page-link">{page}</span></li>
                            <li className={`page-item `}>
                                <button className="page-link" onClick={handleNextPage} disabled={page===orders.totalPages}>Next</button>
                            </li>
                        </ul>
                    </nav>
                    </>
                    

                    )}

                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle}>Order Details</ModalHeader>
                        <ModalBody>
                            {/* <Map1 /> */}

                            <MapContainer center={suppliersCoordinate} zoom={13} style={{ height: "400px" }}>
                                
                                <TileLayer
                                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                    attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a> contributors'
                                />

                                <RoutingMachine />

                                {/* Circle representing the radius */}
                                {/* <Circle center={center} radius={10 * 1000} /> */}

                                <Marker position={suppliersCoordinate} icon={supplierIcon}>
                                    <Popup>
                                        You are here
                                    </Popup>
                                </Marker>
                                 <LayerGroup>
                                    {id && orders.data
                                        .filter(order => order._id === id) // Filter to find the order matching the current id
                                        .map(orderDetails => (
                                            <Marker 
                                                key={orderDetails._id} 
                                                position={reverseLatLon(orderDetails.customerId.location.coordinates)}
                                                icon={customMarker}
                                            >
                                                <Popup>
                                                    Customer's location
                                                </Popup>
                                            </Marker>
                                        ))}
                                </LayerGroup>


                            </MapContainer>

                            <ul>
                                {id && <>
                                    {orders.data.filter((ele) => {
                                        return ele._id === id
                                    }).map((orderDetails) => {
                                        const formattedDate = orderDetails.orderDate
                                        return <div key={orderDetails._id}>
                                            {console.log(orderDetails)}
                                        
                                        <p><b>VehicleType : </b> {orderDetails.lineItems.map(item=>item.vehicleTypeId?.name)}</p>
                                        <p><b>OrderType : </b> {orderDetails.lineItems.map(item=>item.orderType)}</p>
                                        <p><b>Order Date : </b> {formattedDate}</p>
                                        <p><b>Quantity : </b> {orderDetails.lineItems.map(item=>item.quantity)}</p>
                                        <p><b>Purpose : </b> {orderDetails.lineItems.map(item=>item.purpose)}</p>
                                        <p><b>Price : </b>
                                        {orderDetails.price}</p>
                                        <p><b>Address : </b> {orderDetails?.customerId?.building} , {orderDetails?.customerId?.locality}, {orderDetails?.customerId?.state}, {orderDetails?.customerId?.pinCode}, {orderDetails?.customerId?.country}</p>
                                        {/* <p><b>Co-ordinates:</b>
                                        {orderDetails?.customerId?.location?.coordinates[0]},{orderDetails?.customerId?.location?.coordinates[1]}
                                        </p> */}
                                        {/* <p><b>Supplier Name : </b>{orderDetails.supplierId?.username}</p> */}
                                        <p><b>Customer Name : </b>{orderDetails.customerId?.username}</p>
                                        <p><b>Customer Contact Number : </b>{orderDetails.customerId?.mobileNumber}</p>
                                    </div>

                                    })}
                                </>}

                            </ul>
                        </ModalBody>
                    </Modal>
                </div>
            </div>

        </>
    )
}