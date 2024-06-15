import React, { useContext } from "react";
import { VehicleTypeContext } from "../../context/VehicleTypeContext";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

export default function ShowPriceDetails() {
  const { vehicleTypes,vehicleTypeDispatch } = useContext(VehicleTypeContext);
  const { user } = useAuth();
  

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          //console.log(`Attempting to delete vehicle type with ID: ${id}`);
          await axios.delete(`http://localhost:3100/api/vehicleType/${id}`, {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          });
          vehicleTypeDispatch({ type: "REMOVE_VEHICLE_TYPE", payload: id });
          Swal.fire("Deleted!", "The vehicle type has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting vehicle type:", error);
          Swal.fire("Error!", "There was an issue deleting the vehicle type.", "error");
        }
      }
    });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <h2 className="text-center">Price Details</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Vehicle Type Name</th>
              <th>Capacity(in Litres)</th>
              <th>Purpose</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {vehicleTypes.data.map((ele) => (
              <tr key={ele._id}>
                <td>{ele.name}</td>
                <td>{ele.capacity}</td>
                <td>
                  <ul>
                    {ele.prices.map((price) => (
                      <li key={price._id}>{price.purpose}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {ele.prices.map((price) => (
                      <li key={price._id}>₹{price.price}</li>
                    ))}
                  </ul>
                </td>
                {user && user.role==='admin' && (
                  <td>
                    <button 
                      onClick={()=>handleDelete(ele._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

