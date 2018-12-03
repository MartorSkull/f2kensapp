'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, AppState} from 'react-native';
import autoBind from 'auto-bind';
import firebase from 'react-native-firebase'

import NavBar from './NavBar';
import {F2card} from './F2cards';
import {ApiConfig} from "../app.json";
import Logger from "../utils/loggerDebug";
import ComponentAddOn from '../utils/customComponent'

export class Main extends Component {
  constructor(props){
    super(props);
    this.token = global.tokenHandler
    this.state={
      'f2s':[]
    };
    var resp = fetch(
      ApiConfig.url + "f2s/",
      {
        headers: this.token.genHeader()
      }
    ).then((resp) => {
      this.loadF2s(resp)
    });
  }

  async loadF2s(resp) {
    this.setState({"f2s": await resp.json()})
  }

  componentDidMount(){
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      notification.data.student = JSON.parse(notification.data.student)
      this.state.f2s.push(notification.data);
      this.setState(this.state);
    });
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
      var newF2 = notificationOpen.notification.data;
      newF2.data.student = JSON.parse(newF2.data.student);
      this.state.f2s.push(newF2);
      this.setState(this.state);
    })
  }

  componentWillUnmount(){
    this.notificationListener();
    this.notificationOpenedListener();
  }

  render() {
    var cards = this.state.f2s.map((item) => {
      return (<F2card title={item.student.first_name+" "+item.student.last_name}
        time={item.time}
        key={item.id}
        id={item.id}
        state={item.state}>
      {item.motivo}</F2card>)
    })    
    return (
      <View>
        <ScrollView>
          <NavBar title="F2kens"/>
          {cards}
        </ScrollView>
      </View>
    );
  }
}