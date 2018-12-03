'use strict';

import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View, 
  WebView, 
  Linking, 
  ActivityIndicator, 
  AppState} from 'react-native';

import CookieManager from 'react-native-cookies';
import firebase from 'react-native-firebase';
import autoBind from 'auto-bind';

import {Main} from "./components/Main";
import Initialization from "./components/qrshow"
import {providerConfig, ApiConfig} from "./app.json";
import url2dict, {dict2url} from './utils/urlHandler';
import Logger from './utils/loggerDebug';
import ComponentAddOn from './utils/customComponent';
import Err from './components/error';
import Lockscreen from './components/lock';

global.appStages = {
  LOADING:0,
  ERROR:1,
  REGISTERING:2,  
  LOGGED_IN:3,
  LOCKED:4
}

const plataformSpecific = Platform.select({
  ios: {loaderSize: "large"},
  android: {loaderSize: 60}
});

export default class App extends ComponentAddOn {

  constructor(props){
    super(props);
    this.token = global.tokenHandler
    this.state={
      stage:global.appStages.LOADING,
      appState: AppState.currentState
    };

    this.init();
  }

  init(){
    if (this.state.stage != global.appStages.LOADING)
    this.setStateValue('stage', global.appStages.LOADING)

    this.token.init()
    .then((value) => {
      this.checkStage(value);
    })
  }

  async checkStage(resp){
    if(resp){
      if (this.token.status == global.apiStat.LOGGED){
        this.setStateValue('stage', global.appStages.LOCKED);
      } else {
        var token = await firebase.messaging().getToken()
        if (token) {
          await this.token.registerDevice(token);
          this.setStateValue('stage', global.appStages.REGISTERING);
        }
      }
    } else {
      this.setStateValue('stage', global.appStages.ERROR)
    }
  }

  lock(nextAppState){
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.setStateValue("stage", global.appStages.LOCKED)
    }
    this.setStateValue('appState', nextAppState);
  }

  componentDidMount() {
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
      this.token.registerDevice(fcmToken);
    });
    AppState.addEventListener('change', this.lock)
  }

  componentWillUnmount() {
    this.onTokenRefreshListener();
    AppState.removeEventListener('change', this.lock) 
  }


  render() {
    if (this.state.stage == global.appStages.LOGGED_IN){
      return (
        <Main/>
      );
    }
    if (this.state.stage == global.appStages.LOCKED){
      return (
        <Lockscreen parent={this}/>//
      );
    }
    if (this.state.stage == global.appStages.REGISTERING){
      return (
        <Initialization parent={this}/>//
      );
    }
    if (this.state.stage == global.appStages.ERROR){
      return (
        <Err parent={this}/>//
      );
    }
    if (this.state.stage == global.appStages.LOADING){
      return (
        <View style={styles.container}>
          <ActivityIndicator size={plataformSpecific.loaderSize} color={"#0000ff"}/>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: "center"
  }
})