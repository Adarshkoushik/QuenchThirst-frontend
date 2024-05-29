const initialState={
  data:[]
}
export default function vehicleTypeReducer(state=initialState, action){
  switch(action.type){
    case "ADD_VEHICLE_TYPE" : {
      return {...state, data:[...state.data,action.payload]}
    }
    case "SET_VEHICLE_TYPE":{
      return {...state, data:action.payload}
    }
    case "REMOVE_VEHICLE_TYPE":{
      //console.log("---------",action.payload)
      return {...state, data: state.data.filter(ele => ele._id !== action.payload) }
    }
    default:{
      return {...state}
    }
  }
}