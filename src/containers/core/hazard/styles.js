import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
    instruction:{
        flexDirection:'row',
        // flex:1
    },
    textContainer:{
        flex:0.8,
        margin: 8,
        alignItems: 'center',
        justifyContent:'center'
    },
    text:{
        textAlign:'left'
    },
    iconContainer:{
        flex:0.2,
        alignItems: 'center',
        justifyContent:'center'

    },
    chapterContainer:{
        margin:8
    }

});
export default styles;