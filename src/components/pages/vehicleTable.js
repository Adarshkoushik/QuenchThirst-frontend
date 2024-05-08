import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { VehicleTypeContext } from '../../context/VehicleTypeContext';
import Card from './card' 

export default function VehicleTable() {
    const [vehicles, setVehicles] = useState([]);
    const { vehicleTypes } = useContext(VehicleTypeContext);
    

    const handleDelete = deletedVehicleId => {
        setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle._id !== deletedVehicleId));
    };

    useEffect(() => {
        (async () => {
            try {
                const vehicles = await axios.get('http://localhost:3100/api/vehicles', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setVehicles(vehicles.data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return (
        <>
            <h4>Vehicle Details : </h4>
            {vehicles.length === 0 ? (
                <p><b>No vehicle details to display. Please add vehicle details.</b></p>
            ) : (
                <div className="card-container">
                    {vehicles.map(vehicle => (
                        <Card key={vehicle._id} vehicle={vehicle} vehicleTypes={vehicleTypes.data} onDelete={handleDelete}/>
                    ))}
                </div>
            )}
        </>
    // <>
    //     <h4>Vehicle Details : </h4>
    //     <div className="card-container">
    //         {vehicles.map(vehicle => (
    //             <Card key={vehicle._id} vehicle={vehicle} vehicleTypes={vehicleTypes.data} onDelete={handleDelete}/>
    //         ))}
    //     </div>
    // </>
        
    );
}


