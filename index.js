'use strict';

import {AppRegistry, YellowBox} from 'react-native';
import App from './App';
import firebase from "react-native-firebase";
import Logger from "./utils/loggerDebug";
import {name as appName} from './app.json';
import tokenHandler from "./utils/apiHandler";

// Ignore warnings from the firebase bug
YellowBox.ignoreWarnings(['Require cycle:']);

// Create the notification Channel for android
const channel = new firebase.notifications.Android.Channel('f2s', 'f2s', firebase.notifications.Android.Importance.High)
  .setDescription('Channel to recieve f2s')
  .setLockScreenVisibility(firebase.notifications.Android.Visibility.Public);
firebase.notifications().android.createChannel(channel);

// Check and get permissions for messaging
firebase.messaging().hasPermission()
  .then(enabled => {
    if (!enabled) {
      firebase.messaging().requestPermission()
      .then(() => {
        Logger.log("Granted")
      })
      .catch(error => {
        Logger.log("Not Granted")
      });
    } else {
      Logger.log("Already have permissions")
    }
  });

// Create the apps token handler and initialize it
global.tokenHandler = new tokenHandler();

// Start the app
AppRegistry.registerComponent(appName, () => App);
