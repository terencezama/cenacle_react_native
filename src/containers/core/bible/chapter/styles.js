import {StyleSheet, Dimensions} from 'react-native'
import {COLOR} from 'react-native-material-ui'
const screenWidth = Dimensions.get('window').width;
const spacing = 8;
export const itemsPerRow = 5;
const itemSize = ((screenWidth-spacing)/itemsPerRow) - (spacing)
const styles = StyleSheet.create({
    closeIcon:{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    textContainer:{
        marginLeft:8
    },
    itemContainer:{
        flexDirection: 'row',

    },
    item:{
        width: itemSize,
        height: itemSize,
        backgroundColor: COLOR.grey100,
        justifyContent:'center',
        alignItems:'center',
        marginLeft: spacing,
        marginTop: spacing,
    }
});

export default styles;