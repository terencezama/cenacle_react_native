import { put } from 'redux-saga/effects'
import firebase from 'react-native-firebase'
import { Config } from '../../services';
import { performAction, Types } from '..';

export function* welcomeTextSagas(action) {
    console.log('action','welcomeTextSagas',action);
    console.log(Config.env);
    try{
        const query = yield firebase.firestore().collection('cenacle').doc(Config.env).collection('verse').doc('text').get();
        const result = query.data();
        yield put(performAction(result,Types.UPDATE_WELCOME_TEXT));
        // console.log('welcomeTextSagas',);
        // result
    }catch(e){
        console.log('welcomeTextSagas error',e);
    }

}

