import {StyleSheet} from 'react-native'
import uiTheme from '../../../theme';
const styles = StyleSheet.create({
    root:{
        flexDirection:'row',
        flex:1
    },
    dateContainer:{
        flex:0.2,
        justifyContent:'center',
        alignItems: 'center',
        // padding: 8,
    },
    textContainer:{
        flex:0.8,
        margin: 8,
    },
    actionContainer:{
        justifyContent:'flex-end',
        flexDirection:'row',
        alignItems:'center'
    },
    text:{
        color:'white'
    },
    timeContents:{ 
        flexDirection: 'row', 
        alignSelf: 'flex-end', 
        marginRight:8, 
        justifyContent:'center', 
        padding: 8,
        borderRadius: 4,
    }
});
export default styles;