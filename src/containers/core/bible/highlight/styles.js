import {StyleSheet} from 'react-native'
import {COLOR} from 'react-native-material-ui'
import {material} from 'react-native-typography'
const styles = StyleSheet.create({
    content:{
        margin: 16,
    },
    htmlContainer:{
        flex:1,
        flexDirection: 'row',
    },
    html:{
        flex:0.9
    },
    iconContainer:{
        flex:0.1,
        justifyContent:'center',
        alignItems: 'center',
    }
});
export default styles;