const INITIAL_STATE = {
    fetching: false,
    error: null,
    response: null,
    payload: null
  }
  
  
  export const networkReducer = (type) => (state = INITIAL_STATE, action) =>{
    const requestType = `${type}_REQUEST`;
    const successType = `${type}_SUCCESS`;
    const failureType = `${type}_FAILURE`;
    switch (action.type) {
    case requestType:
      return {
        ...state,
        fetching: true,
        error: null,
        response: null,
        payload: action.payload
      }
  
    case successType:
      return {
        ...state,
        fetching: false,
        error: null,
        response: action.payload,
        payload: null
      }
  
    case failureType:
      return {
        ...state,
        fetching: false,
        error: action.payload,
        response: null,
        payload: null
      }
  
    default:
      return state
    }
  }