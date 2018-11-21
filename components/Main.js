'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import autoBind from 'auto-bind';
import firebase from 'react-native-firebase'

import NavBar from './NavBar';
import {F2card} from './F2cards';
import {ApiConfig} from "../app.json";
import Logger from "../utils/loggerDebug";

export class Main extends Component {
  constructor(props){
    super(props);
    autoBind(this);
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
    Logger.log(this.state);
  }

  componentDidMount(){
    this.messageListener = firebase.messaging().onMessage(async (message: RemoteMessage) => {
      message.data.student = JSON.parse(message.data.student)
      this.state.f2s.push(message.data);
      this.setState(this.state);
    });
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