import {StyleSheet} from 'react-native'
import uiTheme from '../../theme';
const styles = StyleSheet.create({
    container:{
        margin: 8,
    },
    b:{
        fontWeight: 'bold',
    },
    i:{
        fontStyle: 'italic'
    },
    t:{
        fontSize: 16
    },
    h:{
        fontSize: 20,
        color:'black',
        fontWeight:'bold'
    },
    ul:{
        margin:4,
        marginRight: 8,
    },
    br:{
        height:2
    },
    ol:{
        margin:4,
        marginRight: 8,
        
    },
    date:{
        color:uiTheme.palette.primaryColor,
        textAlign:'right'
    }
    
});

export default styles;