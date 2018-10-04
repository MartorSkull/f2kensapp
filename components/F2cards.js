'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SendButton} from './SendButton';

export class F2card extends Component {
  render() {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{this.props.title}</Text>
        <View style={styles.row}>
          <Text style={styles.reason}>{this.props.children}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.time}>Hora de salida: {this.props.time}</Text>
        </View>
        <View style={styles.row}>
          <SendButton style={styles.button} type="accept" id="10"/>
          <SendButton style={styles.button} type="reject" id="10"/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F5F5F5",
//    backgroundColor: "#FF00FF",
    margin: 10,
    borderRadius: 5
  },
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