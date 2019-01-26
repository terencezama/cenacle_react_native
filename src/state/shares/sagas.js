import { put, call, takeEvery, take } from 'redux-saga/effects'
import firebase from 'react-native-firebase'
import { Config } from '../../services';
import { performAction, Types } from '..';
import { update } from '../types';
import { eventChannel, END } from 'redux-saga';


function _fetchShares() {
    return eventChannel(emitter => {
        const ref = firebase.firestore().collection('cenacle').doc(Config.env).collection('shares').orderBy('date', 'desc')
        const subscriber = ref.onSnapshot(querySnapshot => {
            let shares = [];
            querySnapshot.forEach((doc) => {
                // console.log('snap',doc.data())
                shares.push({
                    key: doc.id,
                    ...doc.data(), // DocumentSnapshot
                });
            });

            emitter(shares);
        })
        return subscriber;
    });
}



export function* sharesSagas(action) {
    const channel = yield call(_fetchShares);
    while (true) {
        const res = yield take(channel);
        yield put(performAction(res, update(Types.SHARES)));
    }
}

