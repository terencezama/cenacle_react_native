import React, { Component } from 'react'
import {StyleSheet} from 'react-native'
// import {getTheme} from 'react-native-material-ui';
import theme from '../../theme';

const styles = StyleSheet.create({
    container:{
        backgroundColor: theme.palette.primaryColor+"E6",
        flex:1,
        justifyContent:'center'
    },
    text:{
        color:theme.palette.darkTextColor
    },
    content:{
        alignItems:'center'
    }
});

export default styles;