import React from "react";
import { createAppContainer } from "react-navigation";
import { MainNavigator } from "./src/navigation";
import { ThemeContext, getTheme } from "react-native-material-ui";
import uiTheme from "./src/theme";
// REDUX
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import reducers from "./src/state/reducers";
import rootSagas from "./src/state/sagas";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["ui"]
};
const persistedReducer = persistReducer(persistConfig, reducers);

const sagaMiddleware = createSagaMiddleware();
const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
persistStore(store);

sagaMiddleware.run(rootSagas);

// REDUX END

const AppContainer = createAppContainer(MainNavigator);
//FIREBASE
import firebase from "react-native-firebase";
import { Config, NavigationService } from "./src/services";
import { notify } from "./src/services/notification";
firebase.firestore().enablePersistence = Config.firestore.persistence;
//FIREBASE END

export default class App extends React.Component {

  _OnNotificationClicked = notification => {
    console.log('notification clicked',notification);
    const {data} = notification;
    switch (data.tag) {
      case 'event':{
        break;
      }
      case 'share':{

        break;
      }
      case 'summary':{

        break;
      }
      case 'verse':{

        break;
      }
      default:
        break;
    }
    
  }

  _listenToNotifs = () => {
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        const notification = notificationOpen.notification;
        this._OnNotificationClicked(notification);
      });
    firebase
      .notifications()
      .getInitialNotification()
      .then(notificationOpen => {
        if (notificationOpen) {
          // App was opened by a notification
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification = notificationOpen.notification;
          this._OnNotificationClicked(notification);
        }
      });

      this.messageListener = firebase.messaging().onMessage(message => {
        // Process your message as required
        console.log("onMessage", message);
        notify(message);
      });
  };

  componentDidMount() {
    this._listenToNotifs();
    
  }

  componentWillUnmount() {
    this.notificationOpenedListener();
    this.messageListener();
  }
  render() {
    return (
      <Provider store={store}>
        <ThemeContext.Provider value={getTheme(uiTheme)}>
          <AppContainer
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        </ThemeContext.Provider>
      </Provider>
    );
  }
}
