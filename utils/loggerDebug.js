import {Alert} from 'react-native';
import {LoggerConfig} from '../app.json';

export default class Logger{
    static logger_clases = {
        'Production': {
            'log': function(msg) {return},
            'info': function(msg) {Alert.alert("Info", msg, {}, {'cancelable': false})},
            'warning': function(msg) {Alert.alert("Warning", msg, {}, {'cancelable': false})},
            'error': function(msg) {Alert.alert("Error", msg, {}, {'cancelable': false})},
        },
        'Debug': {
            'log': console.log,
            'info': console.info,
            'warning': console.warn,
            'error': console.error,
        }
    }
    static currentMode = LoggerConfig.mode

    static log(msg) {
        this.logger_clases[this.currentMode]['log'](msg)
    }
    
    static info(msg) {
        this.logger_clases[this.currentMode]['info'](msg)
    }

    static warn(msg) {
        this.logger_clases[this.currentMode]['warning'](msg)
    }

    static error(msg) {
        this.logger_clases[this.currentMode]['error'](msg)
    }
}