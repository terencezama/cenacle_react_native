import { Alert } from 'react-native';
import { put } from 'redux-saga/effects'
import { create } from 'apisauce';
import { performAction, Types } from '..';
import { failure, success } from '../types';
const key = 'AIzaSyBgPilXuFf0wa4OASoJc4l6a3KVUE2TCTc';
const playlistId = 'PLNpxzHcoyB6p1PDo2I6mcqNferQBoSEaY';
const baseUrl = 'https://www.googleapis.com';
const path = '/youtube/v3/playlistItems';
const part = 'snippet,contentDetails';

const api = create({
    baseURL: baseUrl
})
export function* playlistVideos(action) {
    const { payload } = action;

    let params = {
        playlistId,
        key,
        part
    };

    if(payload.nextPageToken){
        params['pageToken'] = payload.nextPageToken;
    }
    const res = yield api.get(path, params)
    if (res.ok) {
        // console.log('success youtube videos', res.data);
        yield put(performAction(res.data, success(Types.YOUTUBE_VIDEOS)));
    } else {
        yield put(performAction(res.originalError, failure(Types.YOUTUBE_VIDEOS)));
        setTimeout(() => {
            Alert.alert('Error', res.originalError.message);
        }, 300);
    }

}