import { createStore, combineReducers, applyMiddleware } from 'redux'
import {thunk} from 'redux-thunk'
import requestsReducer from '../reducers/requests-reducer'
import ordersReducer from '../reducers/orders-reducer'
//import vehicleTypeReducer from '../reducers/vehicleTypeReducer'

const configureStore = () => {
    const store = createStore(combineReducers({
        requests: requestsReducer,
        orders:ordersReducer,
        //vehicleType:vehicleTypeReducer
    }), applyMiddleware(thunk))
    return store 
}

export default configureStore