'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import autoBind from 'auto-bind';
import Icon from 'react-native-vector-icons/Feather';

export default class Err extends Component {
  errors = {
    NO_SERVER:{
      icon:"wifi-off",
      message:"No se pudo establecer conexion con el server"
    },
    NO_INTERNET:{
      icon:"wifi-off",
      message:"No posee connexion a internet."
    },
    ERROR_CREDENTIALS:{
      icon:"save",
      message:"Error leyendo las credenciales"
    }
  }

  constructor(props){
    super(props);
    autoBind(this);
    this.token = global.tokenHandler
  }

  getDesign(){
    if(this.token.status == global.apiStat.NO_CONNECTION){
      return(
        <>
          <Icon style={styles.icon} name="wifi-off"/>
          <Text style={styles.welcome}>{"No se pudo establecer conexion con el servidor"}</Text>
        </> 
      );
    } else if (this.token.status == global.apiStat.KEYSTORE_ERROR){
      return (
        <>
          <Icon style={styles.icon} name="save"/>
          <Text style={styles.welcome}>{"Error Leyendo las credenciales"}</Text>
        </>
      )
    }
  }

  render (){
    return(
      <View style={styles.container}>
        {this.getDesign()}
        <Button title={"Re-Intentar"} onPress={() => {this.props.parent.init()}}/>
      </View>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  icon: {
    textAlign: 'center',
    fontSize: 40,
    margin:10
  },
});
