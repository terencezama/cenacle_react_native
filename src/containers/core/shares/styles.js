import {StyleSheet} from 'react-native'
import {COLOR} from 'react-native-material-ui'
import {material} from 'react-native-typography'
const styles = StyleSheet.create({
    content:{
        margin: 16,
    },
    p:{
        ...material.body1
    }
});
export default styles;