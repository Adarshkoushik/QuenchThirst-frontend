import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import axios from "axios"
import '../../Account.css'

export default function Account() {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState({});

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "http://localhost:3100/api/suppliers/account",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setSuppliers(response.data);
    })();
  }, []);

  return (
    <div className="account-container">
      <h2>Account Info</h2>
      {user && (
        <div>
          <p>
            <b>Username : </b>
            {user.username}
          </p>
          <p>
            <b>Mobile Number : </b>
            {user.mobileNumber}
          </p>
          <p>
            <b>Email : </b>
            {user.email}
          </p>
          <p>
            <b>Role : </b>
            {user.role}
          </p>
          {user.role === "customer" && (
            <div className="address-container"> {/* Apply a class for styling */}
              <p>
                <b>Address : </b> <br />
                {user.building},<br /> {user.locality} <br />
                {user.city} - {user.pinCode} <br />
                {user.state} <br />
                {user.country}
              </p>
            </div>
          )}
          {user.role === "supplier" && (
            <div className="supplier-details"> {/* Apply a class for styling */}
              <p>
                <b>Address : </b> <br />
                {suppliers.building},<br /> {suppliers.locality} <br />
                {suppliers.city} - {suppliers.pinCode} <br />
                {suppliers.state} <br />
                {suppliers.country}
              </p>
              <p>
                <b>License Number : </b>
                {suppliers.licenseNumber}
              </p>
              <p>
                <b>Account Holder Name : </b>
                {suppliers.accHolderName}
              </p>
              <p>
                <b>Bank : </b>
                {suppliers.bank}
              </p>
              <p>
                <b>Account Number : </b>
                {suppliers.accNum}
              </p>
              <p>
                <b>IFSC : </b>
                {suppliers.IFSC}
              </p>
              <p>
                <b>Branch : </b>
                {suppliers.branch}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
