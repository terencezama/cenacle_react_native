import { Types } from "../..";



const INITIAL_STATE = {
    data: []
}


export const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case Types.BIBLE_UNDERLINE: {
            return {
                ...state,
                data: action.payload
            }
        }
        default:
            return state
    }
}