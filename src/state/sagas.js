import { takeLatest, all, take } from 'redux-saga/effects'
import { Types } from '.';
import { bibleDbFileCheck, fetchBibleBooks, setChapter, nextChapter, prevChapter, highlightVerses, unhighlightVerses, fetchBibleHighlights, unhighlightVersesId} from './bible/sagas'
import {welcomeTextSagas} from './welcome/sagas'
import {checkUserLoggedIn, loginUser,registerUser,forgotPassword, logoutUser} from './auth/sagas';
import { request } from './types';
import {eventsSagas} from './events/sagas'
import { sharesSagas } from './shares/sagas';
import { summariesSagas } from './summaries/sagas';
import {playlistVideos} from './youtube/sagas'
export default function * root () {
    yield all([

      
      takeLatest(Types.BIBLE_CHECK_DB_FILE,bibleDbFileCheck),
      takeLatest(Types.WELCOME,welcomeTextSagas),
      takeLatest(Types.CHECK_USER_LOGGEDIN,checkUserLoggedIn),

      takeLatest(request(Types.USER_LOGIN),loginUser),
      takeLatest(request(Types.USER_REGISTER),registerUser),
      takeLatest(request(Types.USER_FORGOTPASSWORD),forgotPassword),
      takeLatest(Types.USER_LOGOUT,logoutUser),

      takeLatest(Types.BIBLE_BOOKS_REQUEST,fetchBibleBooks),
      takeLatest(request(Types.BIBLE_CHAPTER),setChapter),
      takeLatest(Types.BIBLE_NEXT_CHAPTER,nextChapter),
      takeLatest(Types.BIBLE_PREV_CHAPTER,prevChapter),
      takeLatest(Types.BIBLE_HIGHLIGHT_VERSES,highlightVerses),
      takeLatest(Types.BIBLE_UNHIGHLIGHT_VERSES,unhighlightVerses),
      takeLatest(Types.BIBLE_UNHIGHLIGHT_VERSES_IDS,unhighlightVersesId),

      takeLatest(request(Types.EVENTS),eventsSagas),
      takeLatest(request(Types.SHARES),sharesSagas),
      takeLatest(request(Types.SUMMARIES),summariesSagas),
      takeLatest(request(Types.BIBLE_HIGHLIGHTS),fetchBibleHighlights),

      takeLatest(request(Types.YOUTUBE_VIDEOS),playlistVideos)


    ])
  }