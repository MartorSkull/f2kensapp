'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavBar} from './NavBar'
import {F2card} from './F2cards'
import {Instructions} from './testInst';


export class Main extends Component {
  render() {
    return (
      <View>
        <NavBar title="F2kens"/>
        <F2card title="Martin Montane" time="12:14">Everything is pain BOIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII</F2card>
      </View>
    );
  }
}