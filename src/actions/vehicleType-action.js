import axios from 'axios'

export const startGetVehicleTypes = () => { 
  return async (dispatch) => {
      try {
          const response = await axios.get(`http://localhost:3100/api/vehicleType}`,{
              headers : {
                  Authorization : localStorage.getItem('token')
              }
          })

          console.log("vehicleTypes.......",response.data)
        
          dispatch(setVehicleType(response.data))
      } catch(err) {
          alert(err.message)
      }
  }
}

const setVehicleType = (data) => {
  return { 
      type: 'SET_VEHICLE_TYPES', 
      payload: data 
  }
}



export const startRemoveVehicleType = (id) => {
  return async (dispatch) => {
      try {
          const response = await axios.delete(`http://localhost:3100/api/vehicleType/${id}`,{
              headers : {
                  Authorization : localStorage.getItem('token')
              }
          })
          console.log("startRemoveVehicleType", response.data)
          dispatch(removeVehicleType(response.data))
      } catch(err) {
          alert(err.message)
          console.log(err.response.data.errors)
      }
  }
}

const removeVehicleType = (data) => {
  return {
      type: 'REMOVE_VEHICLE_TYPE',
      payload: data
  }
}