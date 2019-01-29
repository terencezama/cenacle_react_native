import {combineReducers} from 'redux'
import {networkReducer} from './network'
import {requestReducer} from './request'
import { USER_LOGIN, USER_REGISTER, USER_FORGOTPASSWORD, EVENTS, SHARES, SUMMARIES, BIBLE_CHAPTER, BIBLE_HIGHLIGHTS, YOUTUBE_VIDEOS, BIBLE_CHAPTER_HAZARD } from './types';
import {reducer as uiReducer} from './ui/reducer';
import {reducer as bibleUnderlineReducer } from './bible/underline/reducer';

export default combineReducers({
    user_login:networkReducer(USER_LOGIN),
    user_register:networkReducer(USER_REGISTER),
    user_forgotpassword:networkReducer(USER_FORGOTPASSWORD),
    ui:uiReducer,
    events:requestReducer(EVENTS),
    shares:requestReducer(SHARES),
    summaries:requestReducer(SUMMARIES),
    
    bible_chapter:requestReducer(BIBLE_CHAPTER),
    bible_underline:bibleUnderlineReducer,
    bible_highlights:requestReducer(BIBLE_HIGHLIGHTS),
    playlist:networkReducer(YOUTUBE_VIDEOS),
    bible_hazard:requestReducer(BIBLE_CHAPTER_HAZARD)
})