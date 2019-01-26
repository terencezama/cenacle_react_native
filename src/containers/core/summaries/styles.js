import {StyleSheet} from 'react-native'
const styles = StyleSheet.create({
    content:{
        margin: 16,
    },
    caption:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems: 'center',
    },
    buttonContainer:{
        flexDirection:'row',
        flex:1,
        alignItems: 'center',
        justifyContent:'space-between',
        marginTop: 8,
        marginBottom: 8,
    }
});
export default styles;