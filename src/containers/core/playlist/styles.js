import {StyleSheet,Dimensions} from 'react-native';
import uiTheme from '../../../theme';
const screenWidth = Dimensions.get('window').width;
const spacing = 0;
const styles = StyleSheet.create({
    itemContainer:{
        flex:1,
        margin:spacing,
    },
    image:{
        height:(screenWidth-(spacing*2))/(320/180),
        width:(screenWidth-(spacing*2))
    },
    textContainer:{
        position:'absolute',
        top:0,
        right:0,
        bottom:0,
        left:0,
        justifyContent:'center',
        alignItems: 'center',
    },
    text:{
        backgroundColor:uiTheme.palette.primaryColor,
        margin:8,
        textAlign:'center',
        color:'white',
        paddingRight:8,
        paddingLeft:8
    }

});
export default styles;