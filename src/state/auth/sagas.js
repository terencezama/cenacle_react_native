import { put } from 'redux-saga/effects'
import firebase from 'react-native-firebase';
import { performAction, Types, delay } from '..';
import { success, failure } from '../types';
import { Alert } from 'react-native'
import { i18n, NavigationService } from '../../services';
import { NavigationActions } from 'react-navigation'

export function* checkUserLoggedIn(action) {
    const result = yield new Promise(resolve => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                resolve({ is_loggedin: 1, user });
            } else {
                resolve({ is_loggedin: -1, user: undefined });
            }
        });
    })
    yield put(performAction(result.is_loggedin, Types.UPDATE_USER_LOGGEDIN));
    if (result.user) {
        let collection = firebase.firestore().collection('cenacle').doc('user').collection('details')

        const res = yield collection.doc(result.user.uid).get();
        console.log('trying to get user', res);
        yield put(performAction(res.data(), Types.UPDATE_USER));
    }
}

export function* loginUser(action) {
    console.log('loginUser', action);
    const { payload: { email: mail, password } } = action;
    let email = mail.toLowerCase();
    try {
        const res = yield firebase.auth().signInWithEmailAndPassword(email, password);
        yield put(performAction(1, Types.UPDATE_USER_LOGGEDIN));
        yield put(performAction(res, success(Types.USER_LOGIN)));
        if (res.user) {
            let collection = firebase.firestore().collection('cenacle').doc('user').collection('details')
    
            const userData = yield collection.doc(res.user.uid).get();
            console.log('trying to get user', res);
            yield put(performAction(userData.data(), Types.UPDATE_USER));
        }
        yield delay(600) // delay longer because of double loading screen
        NavigationService.reset('main');

    } catch (e) {
        yield put(performAction(-1, Types.UPDATE_USER_LOGGEDIN));
        yield put(performAction(e, failure(Types.USER_LOGIN)));
        setTimeout(() => {
            Alert.alert('Error', i18n.t(e.code));
        }, 300);

    }
}
export function* registerUser(action) {
    console.log('registerUser', action);
    const { payload: { email: mail, password, mobile, nickname } } = action;
    let email = mail.toLowerCase();
    try {
        const user = yield firebase.auth().createUserWithEmailAndPassword(email, password);
        let collection = firebase.firestore().collection('cenacle').doc('user').collection('details')
        const data = {
            uid: user.user.uid,
            email,
            mobile,
            nickname,
            role: 'user'
        }

        yield collection.doc(user.user.uid).set(data)
        yield put(performAction(data, success(Types.USER_REGISTER)));
        yield delay(300)
        NavigationService.reset_withPrevious(['WelcomeScreen', 'LoginScreen']);

    } catch (e) {
        yield put(performAction(e, failure(Types.USER_REGISTER)));
        setTimeout(() => {
            Alert.alert('Error', i18n.t(e.code));
        }, 300);
    }

}

export function* forgotPassword(action) {
    console.log('forgotPassword', action);
    const { payload: { email: mail } } = action;
    const email = mail.toLowerCase();
    try {
        const res = yield firebase.auth().sendPasswordResetEmail(email);
        yield put(performAction(1, success(Types.USER_FORGOTPASSWORD)));
        setTimeout(() => {
            Alert.alert(
                'Success',
                i18n.t('success-forgetpassword'),
                [
                    { text: 'OK', onPress: () => { NavigationService.pop() } },
                ],
                { cancelable: false }
            )
        }, 300);

    } catch (e) {
        yield put(performAction(e, failure(Types.USER_FORGOTPASSWORD)));
        setTimeout(() => {
            Alert.alert('Error', i18n.t(e.code));
        }, 300);
    }
}

export function* logoutUser(action) {
    console.log('logoutUser', action);
    try {
        const res = yield firebase.auth().signOut();
        yield put(performAction(-1, Types.UPDATE_USER_LOGGEDIN));
        yield delay(300)
        NavigationService.reset('WelcomeScreen')
    } catch (e) {
        // yield put(performAction(-1, Types.UPDATE_USER_LOGGEDIN));
        console.log('logout err', e);
    }
}