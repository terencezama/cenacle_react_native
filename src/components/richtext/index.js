import React, { Component } from 'react';
import {  View, Text, } from 'react-native';
import PropTypes from 'prop-types'
import styles from './styles'
const parse5 = require('parse5');
import moment from 'moment-es6'
import {material} from 'react-native-typography';
const nodes = {
    '#text' : (el,i,s,tag)=>{
        const{value} = el
        console.log(value);
        if(tag == 'ul'){
            return (<Text key={i+200}>{'•  '}<Text key={i} style={[styles.t,s]}>{value}</Text></Text>)
        }else if(tag == 'ol'){
            return (<Text style={[styles.t,styles.b]} key={i+200}>{`${i+1}. `}<Text key={i} style={[styles.t,s]}>{value}</Text></Text>)
        }else{
            return (<Text key={i} style={[material.body1,s]}>{value}</Text>)
        }
        
        
    },
    p: (el,i,s,tag) =>{
        const child = el.childNodes[0]
        if(child == undefined)return;
        let value = null;
        let style = s?s:[];
        // style.push(styles.b)
        console.log('>>>',child.nodeName)
        if(nodes[child.nodeName]){
            return nodes[child.nodeName](child,i,style,tag)
        }else{
            console.log('notfound',child);
            return undefined;
        }
        
    },
    b: (el,i,s,tag)=>{
        const child = el.childNodes[0]
        if(child == undefined)return;
        let value = null;
        let style = s?s:[];
        style.push(styles.b)
        return nodes[child.nodeName](child,i,style,tag)
    },
    strong:(el,i,s,tag)=>{
        return nodes.b(el,i,s,tag);
    },
    div: (el,i,s)=>{
        const{nodeName} = el
        return (<View key={i}>{renderEl(el)}</View>)
    },
    em:(el,i,s,tag)=>{
        return nodes.i(el,i,s,tag);
    },
    ul: (el,i)=>{
        const{nodeName} = el
        return(<View key={i} style={styles.ul}>{renderEl(el,'ul')}</View>)
    },
    i: (el,i,s,tag)=>{
        const child = el.childNodes[0]
        if(child == undefined)return;
        let value = null;
        let style = s?s:[];
        style.push(styles.i)
        return nodes[child.nodeName](child,i,style,tag)
    },
    li:(el,i,s,tag)=>{
        const child = el.childNodes[0]
        if(child == undefined)return;
        let value = null;
        let style = s?s:[];
        return nodes[child.nodeName](child,i,style,tag)
    },
    br:(el,i,s)=>{
        return(<View key={i} style={styles.br}></View>)
    },
    ol:(el,i,s)=>{
        const{nodeName} = el
        return(<View key={i} style={styles.ol}>{renderEl(el,'ol')}</View>)
    }
}

const renderEl= (el,tag)=>{
    const body = el;
    const childrenCount = body.childNodes.length
    let arr = []
    for (let i = 0; i < childrenCount; i++) {
        const element = body.childNodes[i];
        if(element.nodeName in nodes){
            if(tag){
                arr.push(nodes[element.nodeName](element,i,null,tag));
            }else{
                arr.push(nodes[element.nodeName](element,i));
            }
            
            console.log("(x) element",element.nodeName)
        }else{
            console.log("add element",element.nodeName)
        }
        
    }
    return arr
}

class RichText extends Component {




    constructor(props){
        super(props);
        const content = parse5.parse(this.props.item.content);
        const bodyContent = content.childNodes[0].childNodes[1]
        this.state = {
            content:bodyContent
        }
    }

    

    _renderContent =()=>{
        const {content} = this.state
        
        return renderEl(content)
        
    }

  render() {
      const {item} = this.props
      const date = Date.parse(item.date)
      const dateStr = moment(date).format('MMMM Do YYYY')
    return (
      <View style={styles.container}>
      <Text style={styles.h}>{`${item.title}`}</Text>
        {this._renderContent()}
        <Text style={styles.date}>{dateStr}</Text>
      </View>
    );
  }
}

RichText.propTypes = {
    item: PropTypes.object,
  }



  export default RichText;
