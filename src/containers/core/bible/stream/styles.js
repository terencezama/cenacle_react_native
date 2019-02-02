import { StyleSheet } from 'react-native'
import uiTheme from '../../../../theme';

export default StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: 40,
    // backgroundColor:uiTheme.palette.primaryColor,
    

  },
  slider:{
    // backgroundColor:uiTheme.palette.primaryColor
    flex:1,
    margin:0,
    padding:0
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: uiTheme.palette.primaryColor,
    borderRadius: 20,
    marginRight: 4,
    marginLeft: 4,
  },
  titleText: {
    color: '#000',
    fontSize: 15,
    margin: 10,
    fontWeight: '700'
  },
  buttonText: {
    color: '#fff',
    fontSize: 20
  },
  progressText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 20
  },
  player:{
    
    flex:1,
    // height:400,
    // width:M,
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
    
  },
  absolute:{
    position:'absolute',
    top:0,
    bottom:0,
    right:0,
    left:0,
    justifyContent:'center',
    // alignItems:'center'
    // backgroundColor:'#ff0000cc'
  },
  resizing:{
    position:'relative',
    marginLeft:4,
    marginRight:4
    // flex:1,
    // width:'100%',
    // height:'100%',

  }
})
