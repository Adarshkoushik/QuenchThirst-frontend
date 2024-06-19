import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../img/logo.png'


const Header = ({ handleLogout, isAuthenticated }) => {
    const navigate = useNavigate()
    const { user } = useAuth()

    
    return (
        <Navbar bg="dark" variant="dark" expand="lg" >
            <Navbar.Brand as={Link} to={isAuthenticated ? "/login-success" : "/"}>
                <img src={logo} alt="Logo" style={{ height: '30px', marginRight: '10px' }} />
                QT APP
            </Navbar.Brand>
             {/* <Navbar.Brand as={Link} to="/">QT APP</Navbar.Brand> */}

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {!isAuthenticated ? (
                        <>
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            <Nav.Link as={Link} to="/">Login</Nav.Link>
                        </>
                    ) : (
                        <>
                            {/* <Nav.Link as={Link} to="/account">Account</Nav.Link> */}
                            <Nav.Link as={Link} to="/price-details">Price Details</Nav.Link>
                            {user?.role === 'admin' && (
                                <>
                                    <Nav.Link as={Link} to="/add-vehicleType">AddVehicleType</Nav.Link>
                                    <Nav.Link as={Link} to="/admin-dashboard">Home</Nav.Link>
                                </>
                            )}
                            {user?.role === 'customer' && (
                                <>
                                    <Nav.Link as={Link} to="/customer-requests">Requests Details</Nav.Link>
                                    <Nav.Link as={Link} to="/customerPrevious-orders">PreviousOrders</Nav.Link>
                                    <Nav.Link as={Link} to="/customer-orders">Orders Details</Nav.Link>
                                    <Nav.Link as={Link} to="/customer-dashboard">Home</Nav.Link>
                                </>
                            )}
                            {user?.role === 'supplier' && (
                                <>
                                    <Nav.Link as={Link} to="/supplier-requests">Requests</Nav.Link>
                                    <Nav.Link as={Link} to="/supplierPrevious-orders">PreviousOrders</Nav.Link>
                                    <Nav.Link as={Link} to="/supplier-orders">Orders</Nav.Link>
                                    <Nav.Link as={Link} to='/supplier-dashboard'>Home</Nav.Link>
                                </>
                            )}
                            <NavDropdown title="More" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/account">Profile</NavDropdown.Item>
                                {/* <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item> */}
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={() => {
                                    handleLogout()
                                    navigate('/')
                                }}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
