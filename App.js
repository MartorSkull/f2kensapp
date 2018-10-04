'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View, WebView, Linking} from 'react-native';
import {Main} from "./components/Main";
import {providerConfig} from "./app.json";
import url2dict, {dict2url} from './utils/urlHandler';
import {encode as btoa} from 'base-64';

type Props = {};
export default class App extends Component<Props> {

  url = {uri: providerConfig.authorizeUrl+"?client_id="+providerConfig.client_id+"&state=random_state_string&response_type=code"}

  componentDidMount() {
  Linking.addEventListener('url', this._handleOpenURL);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);
  }

  _handleOpenURL(event) {
    var getData = url2dict(event.url);
    var resp = fetch(
      providerConfig.tokenUrl,
      {
        method: 'POST',
        body: dict2url({
          'code': getData['code'],
          'redirect_uri': "f2kens://token",
          'grant_type': "authorization_code"
        }),
        headers: {
          'Authorization': "Basic " + btoa(providerConfig.client_id + ":" + providerConfig.client_secret),
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }
    )
    .then((data) => {
      return data.json()
    })
  }

  render() {
    return (
      <WebView 
        source={this.url}
        javaScriptEnabled={false}
        onNavigationStateChange={(navState) => console.log(navState)}
        startInLoadingState={true}
        automaticallyAdjustContentInsets={false}
      />
    );
    // return (
    //     <Main/>
    // );
  }
}