import { useContext, useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import leaflet from 'leaflet'
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet'
import { useAuth } from '../../../context/AuthContext'
import { MapLocationContext } from '../../../context/MapContext'
import { Icon } from 'leaflet'
import pin from '../../../img/pin.png'


export default function Map(){
  const {user}=useAuth()
  console.log("user-",user)
  // console.log("user",user.location.coordinates)

  const {mapLocations}=useContext(MapLocationContext)
  console.log("mapLocations-",mapLocations)
  console.log("mapLocations-1-",mapLocations.data.location?.coordinates)

  const customMarker = new Icon({
    iconUrl: pin,
    iconSize: [38, 38]
})
  
  function reverseLatLon(arr) {
    return [arr[1], arr[0]]
  }

  // const [center, setCenter]=useState([coordinates[1],coordinates[0]])
  const [center, setCenter]=useState(null)
  console.log("center-", center)

  useEffect(()=>{
    const userCenter=user?.location?.coordinates
    console.log("userCenter-",userCenter)
    if(userCenter){
      setCenter(reverseLatLon(userCenter))
    }
  },[user])

  if(!center || !mapLocations){
    return <div>Loading...</div>
  }
  
  return (
    <div>
       <MapContainer
                    center={center} zoom={11} style={{ height: '400px' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Circle representing the radius */}
                    <Circle center={center} radius={10 * 1000} />

                    {/* Display nearby services as markers */}
                    {mapLocations.data.map((ele, index) => (
                        <Marker 
                          key={index} 
                          position={ele.location?.coordinates} icon={customMarker}
                        >                      
                            {/* <Popup><Link to={`/spaceBookingPage/${space._id}`}>{space.title}</Link></Popup> */}
                        </Marker>
                    ))}
                   <Marker position={center} >
                      <Popup>You are here</Popup>
                   </Marker>
                </MapContainer>
                <p className="text-center mt-4 mb-4"><i><u><b>Water Tankers available in your location:</b></u></i> <span className="badge bg-primary">{mapLocations?.data?.length}</span></p>
    </div>
  )
}