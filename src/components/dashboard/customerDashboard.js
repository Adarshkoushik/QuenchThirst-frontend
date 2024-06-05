import React,{ useEffect, useReducer } from "react";
import axios from 'axios'
import RequestForm from "../pages/requestForm";
import Map from "../pages/location/map";
import mapLocationReducer from '../../reducers/suppliersMap-reducer'
import { MapLocationContext } from "../../context/MapContext";


export default function CustomerDashboard(){

    const [mapLocations, mapLocationDispatch]=useReducer(mapLocationReducer,{data:[], serverErrors:[]})

    useEffect(()=>{
        if(localStorage.getItem('token')){
          const fetchLocation=async()=>{
            try{
              const response=await axios.get('http://localhost:3100/api/suppliers/co',{
                headers:{
                  Authorization:localStorage.getItem('token')
                }
              })
              console.log("suppliers locations-",response.data)
              mapLocationDispatch({type:'SET_MAP_LOCATION', payload:response.data})
            }
            catch(err){
              console.log(err)
            }
          }
          fetchLocation();
        }
      },[])
    
    return (
        <div>
            <h3>Customer Dashboard</h3>
            <MapLocationContext.Provider value={{mapLocations, mapLocationDispatch}}>
                <>
                <Map /><br />
                <RequestForm />
                </>    
            </MapLocationContext.Provider>
        </div>
    )
}