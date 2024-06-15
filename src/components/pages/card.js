import React from 'react';
import axios from 'axios';
import '../../card.css'

const Card = ({ vehicle, vehicleTypes, onDelete }) => {
    console.log("veh:",vehicle)
    const vehicleType = vehicleTypes.find(type => type._id === vehicle?.vehicleTypeId?._id);
    const typeName = vehicleType ? vehicleType.name : 'Unknown';

    const handleDelete = async () => {
        try {
            const confirm = window.confirm('Are you sure you want to delete this vehicle ?')
            if(confirm){
                await axios.delete(`http://localhost:3100/api/vehicles/${vehicle._id}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                onDelete(vehicle._id); // Update the state in the parent component
            }
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    return (
        <div className="card" >
            <h3><b>{vehicle.vehicleNumber}</b></h3>
            <h6><b>Vehicle Type : </b>{typeName}</h6>
            <div className="actions">
                <button onClick={()=>handleDelete()}>Delete</button>
            </div>
        </div>
    );
}

export default Card