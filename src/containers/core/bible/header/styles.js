import {StyleSheet} from 'react-native'
const styles = StyleSheet.create({
    title:{
        marginRight:8,
        marginLeft: 8,
    },
    titleContainer:{
        flexDirection:'row',
        alignItems:'center'
    },
    container:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
    },
    actionContainer:{
        flexDirection:'row'
    },
    fontContainer:{
        flexDirection:'row',
        borderRadius: 4,
        marginRight:4
        // padding: -16,
    }
});
export default styles;