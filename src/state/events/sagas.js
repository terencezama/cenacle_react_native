import { put, call, takeEvery, take } from 'redux-saga/effects'
import firebase from 'react-native-firebase'
import { Config } from '../../services';
import { performAction, Types } from '..';
import { update } from '../types';
import { eventChannel, END } from 'redux-saga';


function _fetchEvents() {
    return eventChannel(emitter => {
        const ref = firebase.firestore().collection('cenacle').doc(Config.env).collection('events').orderBy('jsdate', 'desc')
        const subscriber = ref.onSnapshot(querySnapshot => {
            let events = [];
            querySnapshot.forEach((doc) => {
                events.push({
                    id: doc.id,
                    ...doc.data(), // DocumentSnapshot
                });
            });

            let expired = []
            let nonExpired = []
            const cdate = new Date()
            /*
            const date = moment(adate).format('MMM/DD/YYYY').split('/')
            const month = date[0].toUpperCase().replace('.', '');
            const day = date[1]
            const year = date[2]
            */
            for (const event of events) {
                const date = new Date(event.date);
                if (date.getDate() < cdate.getDate()) {
                    event.expired = true
                    expired.push(event);
                } else {
                    nonExpired.push(event);
                }
            }
            expired = expired.reverse();
            events = [
                ...nonExpired,
                ...expired
            ]

            emitter(events);
        })
        return subscriber;
    });
}



export function* eventsSagas(action) {
    console.log('action', 'welcomeTextSagas', action);
    console.log(Config.env);
    const channel = yield call(_fetchEvents);
    // yield takeEvery(channel,function *(params) {
    //     // console.log('snapied',params);
    //     yield put(performAction(params,update(Types.EVENTS)));
    // })
    while(true){
        const res = yield take(channel);
        yield put(performAction(res,update(Types.EVENTS)));

        // console.log('res',res);

    }

}

