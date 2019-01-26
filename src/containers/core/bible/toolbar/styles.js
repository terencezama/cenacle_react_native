import { StyleSheet } from 'react-native';
import uiTheme from '../../../../theme';

const styles = StyleSheet.create({
    body: { 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        
    },
    container:{
        justifyContent: "space-around",
        flexDirection: 'row', 
    },
    iconContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: uiTheme.palette.primaryColor,
        borderRadius: 25,
        marginRight: 8,
        marginLeft: 8,
    },
    navbutton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: uiTheme.palette.primaryColor,
        borderRadius: 20,
        marginRight: 4,
        marginLeft: 4,
    },
    text: {
        fontSize: 20,
        color: uiTheme.palette.textColor
    }
});

export default styles;