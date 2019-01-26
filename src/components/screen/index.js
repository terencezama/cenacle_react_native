import React, { Component } from 'react'
import { Text, View, Modal, ActivityIndicator } from 'react-native'
import styles from './styles';
import {withTheme} from 'react-native-material-ui';
import {material} from 'react-native-typography'
import { i18n } from '../../services';
class Screen extends Component {
  render() {
      const {theme:{palette}} = this.props;
    return (
      <View style={{flex:1}}>
        {this.props.children}
        <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.loading}
                onRequestClose={()=>{}}
               >
               <View style={styles.container}>
                   <View style={styles.content}>
                   <ActivityIndicator size="large" color={palette.darkTextColor}/>
                   <Text style={[material.titleWhite]}>{i18n.t('loading')}</Text>
                   </View>
               </View>
                </Modal>
      </View>
    )
  }
}

export default withTheme(Screen)
