import {StyleSheet} from 'react-native'
import { alpha } from '../../lib/color';
const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      textContainer:{
          position:'absolute',
          padding: 8,
          bottom:0,
          right:0,
          left:0,
          backgroundColor:'#ffffff'+alpha[75]
      }
});

export default styles;