const INITIAL_STATE = {
    fetching: false,
    data: null,
    payload: null
  }
  
  
  export const requestReducer = (type) => (state = INITIAL_STATE, action) =>{
    const requestType = `${type}_REQUEST`;
    const updateType = `${type}_UPDATE`;
    
    switch (action.type) {
    case requestType:
      return {
        ...state,
        fetching: true,
        payload: action.payload
      }
  
    case updateType:
      return {
        ...state,
        fetching: false,
        data: action.payload,
        payload: null
      }
  
  
    default:
      return state
    }
  }