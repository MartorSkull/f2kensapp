'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import autoBind from 'auto-bind';
import {ApiConfig} from "../app.json";
import {SendButton} from './SendButton';
import Logger from '../utils/loggerDebug';

export class F2card extends Component {
  constructor(props) {
    super(props);
    autoBind(this)
    this.token = global.tokenHandler;
    this.id = props.id;

    this.getData();

    this.state = {
      title: "",
      reason: "",
      time: "",
      state: "En espera"
    };
  }

  getData(){
    fetch(ApiConfig.url + "f2/"+this.id,
    {
      headers: this.token.genHeader()
    })
      .then((resp) => {
        return resp.json()
      })
      .then((json) => {
        this.setState({
          title: json.student.first_name+" "+json.student.last_name,
          reason: json.motivo,
          time: json.time,
          state: json.state
        })
      })
  }

  cardStyle(){
    var color = "#F5F5F5"
    if (this.state.state=="Rechazado"){
      color = "#F56969"
    } else if (this.state.state=="Aprobado"){
      color = "#78F562"
    }
    return({
        margin: 10,
        borderRadius: 5,
        backgroundColor: color
    });
  }

  render() {
    return (
      <View style={this.cardStyle()}>
        <Text style={styles.cardTitle}>{this.state.title}</Text>
        <View style={styles.row}>
          <Text style={styles.reason}>{this.state.reason}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.time}>Hora de salida: {this.state.time}</Text>
        </View>
        <View style={styles.row}>
          <SendButton parent={this} style={styles.button} type="accept" id={this.id} status={this.state.state}/>
          <SendButton parent={this} style={styles.button} type="reject" id={this.id} status={this.state.state}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 25,
    marginHorizontal: 10 ,
    borderBottomWidth: 0.5,
  },
  reason: {
    fontSize: 18,
    flex:1
  },
  time: {
    marginBottom: 10
  },
  button: {
    flex: .5,
    marginHorizontal: 10
  }
});