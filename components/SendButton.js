'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Alert} from 'react-native';
import autoBind from 'auto-bind';
import {ApiConfig} from '../app.json';
import {_request} from "../utils/apiHandler";

import Logger from "../utils/loggerDebug"

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

  constructor(props){
    super(props);
    autoBind(this);
    this.id = props.id
    this.token = global.tokenHandler;
    this.parent = props.parent
  }

  send(){
    _request(
      ApiConfig.url + "update_f2_state/form_id_"+this.id+"/",
      "POST",
      {},
      {estado: this.types[this.props.type].code},
      this.token.genHeader()
    ).then((response) => {
      this.parent.getData();
    }).catch((e) => {
        Logger.error("Not Connected "+e.message);
      });
  }

  render() {
    if (this.types[this.props.type].code == this.props.status){
      this.status=true;
    } else {
      this.status=false;
    }
    return (
      <View style={this.props.style}>
        <Button
          onPress={() => {this.send()}}
          title={this.types[this.props.type].title}
          color={this.types[this.props.type].color}
          disabled={this.status}
          />
      </View>
    )
  }
}