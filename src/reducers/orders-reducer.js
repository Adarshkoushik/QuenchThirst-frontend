import { array } from "yup"

const initialState = {
    data: [],
    serverErrors: []
}

const ordersReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CUSTOMER_ORDERS': {
            return { ...state, data: action.payload }
        }
        case 'SET_SUPPLIER_ORDERS': {
            return { ...state, data: action.payload }
        }

        case 'SET_ERRORS': {
            return { ...state, serverErrors: action.payload }
        }

        case 'UPDATE_ORDER' : {
            return {
                ...state,
                data: state.data.map(order => {
                    if (order._id === action.payload) {
                        return {
                            ...order,
                            isFulfilled : true
                        };
                    }
                    return order;
                })
            }
        }

        case 'UPDATED_ORDER' : {
            console.log("action",action.payload)
            return {
                ...state,
                data : [...state.data, {...action.payload}]
                // data: state.data.map(order => {
                //     if (order._id === action.payload) {
                //         return {
                //             ...order,
                //             status: 'accepted'
                //         };
                //     }
                //     return order;
                // })
            }
        }
        // case 'UPDATE_ORDER':
        //     const updatedOrder = action.payload;
        //     const updatedOrders = state.orders.map(order => {
        //         if (order._id === updatedOrder._id) {
        //             return updatedOrder;
        //         }
        //         return order;
        //     });
        //     return {
        //         ...state,
        //         orders: updatedOrders
        //     };
        
        default: {
            return { ...state }
        }
    }
}

export default ordersReducer

