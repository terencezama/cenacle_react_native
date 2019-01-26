import { Types } from "..";
import { update } from "../types";

const INITIAL_STATE = {
  bible_db_file_downloaded: false,
  //user_logged_in, 
  //  -1 user not logged in
  //  0 undefined
  //  1 user logged in
  user_logged_in: 0,
  user: undefined,
  welcome: {
    title: '',
    verse: ``
  },
  bible_books: [],
  bible_font_size: 16,
  bible_current_book: undefined,
  bible_audio_visible:false
}


export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.UPDATE_USER_LOGGEDIN:
      return {
        ...state,
        user_logged_in: action.payload
      }
    case Types.UPDATE_USER:
      return {
        ...state,
        user: action.payload
      }
    case Types.UPDATE_WELCOME_TEXT:
      return {
        ...state,
        welcome: {
          ...action.payload
        }
      }
    case Types.BIBLE_DB_FILE_DOWNLOADED:
      return {
        ...state,
        bible_db_file_downloaded: action.payload
      }
    case Types.BIBLE_BOOKS_UPDATE:
      return {
        ...state,
        bible_books: action.payload
      }
    case Types.BIBLE_INC_FONTSIZE:{
      let f = state.bible_font_size + 1;
      if( f > 25){
        f = 25;
      }
        return {
          ...state,
          bible_font_size: f
        }
    }
    case Types.BIBLE_AUDIO_TOGGLE:{
      return{
        ...state,
        bible_audio_visible:!state.bible_audio_visible
      }
    }
    
   
    case Types.BIBLE_DEC_FONTSIZE:
      let  f = state.bible_font_size - 1;
      if (f < 9) {
        f = 9;
      }
      return {
        ...state,
        bible_font_size: f
      }

      case update(Types.BIBLE_CURRENT_BOOK):{

        return{
          ...state,
          bible_current_book: action.payload
        }
      }

      

    default:
      return state
  }
}