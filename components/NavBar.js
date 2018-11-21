import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default class NavBar extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.item, styles.title]}>{this.props.title}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'powderblue',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    flexGrow: 1
  },
  title: {
    fontSize: 30,
    textAlign: 'center'
  }
})