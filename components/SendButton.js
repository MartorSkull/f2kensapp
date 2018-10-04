'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Alert} from 'react-native';
import {ApiConfig} from '../app.json';

export class SendButton extends Component {
  types = {
    accept: {
      title: "✔️",
      color: "#39f639",
      code: "Aprobado"
    },
    reject: {
      title: "✖️",
      color: "#f63939",
      code: "Rechazado"
    }
  }
  status=false;

  constructor(){
    super();
  }

  send(){
    fetch(ApiConfig.url + "students")
      .then((response) => response.json())
      .then((responseJson) => {
      console.log(responseJson);})
      .catch((e) => {
        Alert.alert("Not Connected", e.message);
      });
  }

  render() {
    return (
      <View style={this.props.style}>
        <Button
          onPress={this.send}
          title={this.types[this.props.type].title}
          color={this.types[this.props.type].color}
          disabled={this.status}
          />
      </View>
    )
  }
}