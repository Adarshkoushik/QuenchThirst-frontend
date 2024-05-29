const initialState = {
    data: [],
    totalPages:1,
    serverErrors: []
}

const ordersReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CUSTOMER_ORDERS': {
            return { ...state, data: action.payload }
        }
        case 'SET_SUPPLIER_ORDERS': {
            return { ...state, data:action.payload.orders, totalPages:action.payload.totalPages}
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
            }
        }
        
        default: {
            return { ...state }
        }
    }
}

export default ordersReducer

