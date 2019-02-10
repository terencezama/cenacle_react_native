/** @format */
console.log = () => {};
import {AppRegistry,AsyncStorage} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import {name as appName} from './app.json';
import bgMessaging from './src/services/messaging';
AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(()=>require('./src/services/trackplayer'));
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage',()=>bgMessaging);