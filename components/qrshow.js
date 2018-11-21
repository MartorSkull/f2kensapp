import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import firebase from 'react-native-firebase';
import QRCode from 'react-native-qrcode'; 
import autoBind from 'auto-bind';

import NavBar from './NavBar';
import Logger from '../utils/loggerDebug';

export default class Initialization extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.parent = props.parent
    this.token = global.tokenHandler
    this.state = {
      id: this.token.fcmStatus.deviceId
    };
  }

  componentDidMount() {
    this.messageListener = firebase.messaging().onMessage(async (message: RemoteMessage) => {
      await this.token.saveCred(message.data.access_token, message.data.refresh_token)
      this.parent.setState({
        stage:global.appStages.LOGGED_IN
      })
    });
  }

  componentWillUnmount() {
    this.messageListener();
  }

  render() {
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex:1
  },
  instructions: {
    marginBottom:10,
    fontSize:20
  },
  center:{
    flex:1,
    alignItems: 'center',
    justifyContent:'center'
  }
});
