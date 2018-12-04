import React, {Component} from 'react';
import {StyleSheet, Text, View, AsyncStorage, TextInput} from 'react-native';

import firebase from 'react-native-firebase';
import QRCode from 'react-native-qrcode'; 
import autoBind from 'auto-bind';

import NavBar from './NavBar';
import Logger from '../utils/loggerDebug';
import ComponentAddOn from '../utils/customComponent'

global.initStatus = {
  QR:0,
  PIN1:1,
  PIN2:2,

}

export default class Initialization extends ComponentAddOn {
  constructor(props) {
    super(props);
    autoBind(this);
    this.parent = props.parent;
    this.token = global.tokenHandler;
    this.PIN = '';
    this.state = {
      id: this.token.fcmStatus.deviceId,
      status: this.token.status == global.apiStat.NOT_LOGGED ? global.initStatus.QR : global.initStatus.PIN1,
      error: false
    };
  }

  componentDidMount() {
    this.messageListener = firebase.messaging().onMessage(async (message: RemoteMessage) => {
      await this.token.saveCred(message.data.access_token, message.data.refresh_token)
      this.setStateValue('status', global.initStatus.PIN1)
    });
  }

  componentWillUnmount() {
    this.messageListener();
  }

  updt(text){
    if (text.length==4){
      if (this.state.status == global.initStatus.PIN1){
        this.PIN = text
        this.setStateValue('value', '')
        this.setStateValue('status', global.initStatus.PIN2)
      } else if (this.PIN == text){
        this.token.savePin(this.getHash(this.PIN))
        this.parent.setStateValue('stage', global.appStages.LOGGED_IN)
      } else if (this.PIN != text){
        this.setStateValues([
          {key: 'value', 'value': ""},
          {key:'status', value: global.initStatus.PIN1},
          {key: 'error', value:true}
        ])
      }
    }
  }

  render() {
    if (this.state.status == global.initStatus.QR){
      return (
        <View style={styles.container}>
          <NavBar title={"Registro"}/>
          <View style={styles.center}>
            <Text style={styles.instructions}>
            Porfavor muestre este codigo al preceptor
            </Text>
            <QRCode
              value={this.state.id+""}
              size={200}
              fgColor={"#FAFAFA"}
            />
          </View>
        </View>//
      );
    }
    if (this.state.status >= global.initStatus.PIN1){
      return (
        <View style={styles.container}>
          <NavBar title={"Registro"}/>
          <View style={styles.center}>
            <Text style={styles.instructions}>
              {this.state.status == global.initStatus.PIN1 ? 'Ingrese un PIN' : 'Reingrese el PIN'}
            </Text>
            <TextInput
              value={this.state.value}
              keyboardType={"numeric"}
              secureTextEntry={true}
              textContentType={"password"}
              maxLength={4}
              onChangeText={(txt) => {this.setStateValue('value', txt);this.updt(txt)}}
              style={styles.input}/>
            {this.state.error ? <Text style={styles.error}>Los PINs deben ser iguales</Text> : null}
          </View>
        </View>//
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex:1
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor:'powderblue',
    minWidth: 150,
    marginBottom:10,
    textAlign:"center"
  },
  number: {
    fontSize:40
  },
  error: {
    color:"red",
    fontSize: 14,
  },
  instructions: {
    marginBottom:10,
    fontSize:20,
    textAlign: "center"
  },
  center:{
    flex:1,
    alignItems: 'center',
    justifyContent:'center'
  }
});
