import React from "react";
import * as forge from 'node-forge';
import autoBind from 'auto-bind'

export default class ComponentAddOn extends React.Component{

    constructor(props) {
        super(props);
        autoBind(this)
    }

    getHash(i){
        var md = forge.md.sha256.create();
        md.update(i);
        return(md.digest().toHex())
      }

    setStateValue(key, value){
        var newState = this.state
        newState[key] = value
        this.setState(newState)
    }
 
    setStateValues(values){
        var newState = this.state
        values.forEach((value) =>{
            newState[value.key] = value.value
        });
        this.setState(newState)
    }
}