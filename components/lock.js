'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';

import autoBind from 'auto-bind';
import * as forge from 'node-forge';

import NavBar from './NavBar';
import Logger from '../utils/loggerDebug';
import ComponentAddOn from '../utils/customComponent'

export default class Lockscreen extends ComponentAddOn {
  constructor(props) {
    super(props);
    autoBind(this);
    this.parent = props.parent
    this.token = global.tokenHandler
    this.state = {
      hash: this.token.localStatus.hash
    }
  }

  log(e){
    if (e.length==4){
      var hash = this.getHash(e);
      if (hash == this.state.hash){
        this.parent.setStateValue('stage', global.appStages.LOGGED_IN)
      }else{
        this.setStateValues([
          {key:'error', value:true},
          {key:'value', value:''}])
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={"Contrasena"}/>
        <View style={styles.center}>
          <Text style={styles.instructions}>
          Porfavor ingrese el PIN
          </Text>
          <TextInput 
            value={this.state.value}
            secureTextEntry={true} 
            keyboardType={'numeric'}
            textContentType={'password'} 
            maxLength={4} 
            onChangeText={(txt) => {this.log(txt)}} 
            style={styles.input}/>
            {this.state.error ? <Text style={styles.error}>El PIN es incorrecto</Text> : null}
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
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor:'powderblue',
    minWidth: 150,
    marginBottom:10,
    textAlign:"center"
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