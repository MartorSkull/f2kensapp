'use strict';

import { AsyncStorage } from "react-native";
import {providerConfig, ApiConfig} from "../app.json";
import {encode} from 'base-64';
import * as Keychain from 'react-native-keychain';
import Logger from './loggerDebug'
import url2dict, {dict2url} from './urlHandler';
import autoBind from 'auto-bind';


global.apiStat = {
  INITIALIZING:0,
  NO_CONNECTION:1,
  KEYSTORE_ERROR:2,
  NOT_LOGGED:3,
  NO_PIN:4,
  LOGGED:5
}

export default class tokenHandler{
  constructor() {
    autoBind(this);
    this.status = global.apiStat.INITIALIZING
    this.credStatus = {
      'accessToken':'',
      'refreshToken':'',
      'state':false
    }
    this.localStatus = {
      hash: '',
      state:false
    }
    this.fcmStatus = {
      deviceId: null,
      token:null
    }
  }

  async init(){
    if(!await this.checkConnection()){
      Logger.log("No Connection")
      this.status = apiStat.NO_CONNECTION
      return(false);
    }
    if(!await this.loadCred()){
      Logger.Log("Keystore Error")
      this.status = apiStat.KEYSTORE_ERROR
      return(false);
    }
    if(!await this.loadPin()){
      Logger.Log("Keystore Error")
      this.status = apiStat.KEYSTORE_ERROR
      return(false);
    }
    if(!await this.checkPin()){
      this.status = apiStat.NO_PIN
      return(true)
    }
    if(!await this.checkCred()){
      this.status = apiStat.NOT_LOGGED
    } else {
      this.status = apiStat.LOGGED
    }
    return(true);
  }

  async checkConnection(){
    var resp = await _request(ApiConfig.url,"HEAD",{},{},{})
      .catch(() => {return(false);});
    return Boolean(resp);
  }

  async loadCred(){
    try {
      const credentials = await Keychain.getInternetCredentials(ApiConfig.url);
      if (credentials) {
        this.credStatus = {
          'state': true,
          'accessToken': credentials['password'],
          'refreshToken': credentials['username']
        }
      } else {
        Logger.log("No credentials");
      }
      return(true);
    } catch (err) {
        Logger.error("Error loading token: \n"+err);
        return(false);
    }
  }

  async loadPin(){
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        this.localStatus = {
          state:true,
          'hash': credentials['password']
        }
      } else {
        Logger.log("No password");
      }
      return(true);
    } catch (err) {
        Logger.error("Error loading token: \n"+err);
        return(false);
    }
  }

  async saveCred(accessToken, refreshToken){
    try {
      await Keychain.setInternetCredentials(
        ApiConfig.url,
        refreshToken,
        accessToken
      );
      await this.loadCred()
      return(true)
      } catch (err) {
        Logger.error("Error saving token: \n"+err);
        return(false);
    }
  }

  async savePin(hash){
    try{
      await Keychain.setGenericPassword(
        "None",
        hash
      );
      await this.loadPin();
      return(true);
    } catch (err) {
      Logger.error("Error Saving password: \n"+err)
      return(false)
    }
  }

  async resetCred(){
    try {
      await Keychain.resetInternetCredentials(ApiConfig.url);
      this.credStatus = {
        'accessToken': '',
        'refreshToken': '',
        'state': false
      };
      return(true);
    } catch (err) {
      return(false)
    }
  }

  async resetPin(){
    try {
      await Keychain.resetGenericPassword();
      this.localStatus = {
        'hash': '',
        state:false
      };
      return(true);
    } catch (err) {
      return(false)
    }
  }

  async checkCred(){
    if (!this.credStatus.state){
      return(false)
    }
    var obj = await _request(
      ApiConfig.url+'f2s/',
      'GET',{},{},
      this.genHeader())

    if (obj){
      return(obj.status>=200 && obj.status<300);
    }
    return obj
  }

  async checkPin(){
    if (!this.localStatus.state){
      return(false)
    }
    return(true)
  }

  genHeader(){
    let headers = {
      "Authorization": 'Bearer '+this.credStatus.accessToken,
    };
    return headers;
  }

  async registerDevice(token){
    var resp = await _request(
      ApiConfig.url+"reg_device/",
      "POST",{},
      {token: token},{}
    );
    resp = await resp.json()

    if(resp["status"]){
      this.fcmStatus={
        deviceId: Number(resp['device']),
        token:token}
    }
    return this.fcmStatus.deviceId
  }

}

export async function _request(url,method="GET",urlattr={}, body={},headers={}){
  headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  var resp = await fetch(
      url+dict2url(urlattr),
      {
        method: method,
        body: dict2url(body),
        headers: headers
      }).then((data) => {return data;})
      .catch((err) => {return false});
  return(resp);
}