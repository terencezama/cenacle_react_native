import { put, call, takeEvery, take } from 'redux-saga/effects'
import firebase from 'react-native-firebase'
import { Config } from '../../services';
import { performAction, Types } from '..';
import { update } from '../types';
import { eventChannel, END } from 'redux-saga';


function _fetchSummaries() {
    return eventChannel(emitter => {
        const ref = firebase.firestore().collection('cenacle').doc(Config.env).collection('summaries').orderBy('date', 'desc')
        const subscriber = ref.onSnapshot(querySnapshot => {
            let summaries = [];
            querySnapshot.forEach((doc) => {
                // console.log('snap',doc.data())
                summaries.push({
                    key: doc.id,
                    ...doc.data(), // DocumentSnapshot
                });
            });

            emitter(summaries);
        })
        return subscriber;
    });
}



export function* summariesSagas(action) {
    const channel = yield call(_fetchSummaries);
    while (true) {
        const res = yield take(channel);
        yield put(performAction(res, update(Types.SUMMARIES)));
    }
}

