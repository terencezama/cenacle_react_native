import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { TextField } from 'react-native-material-textfield'
import { Formik } from 'formik';
import { withTheme, Button, Card } from 'react-native-material-ui'
import { i18n, NavigationService } from '../../../services';
import { material } from 'react-native-typography'
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { performAction, Types } from '../../../state';
class WelcomeScreen extends Component {
  static navigationOptions = {
    title: i18n.t('welcome_title'),
  };

  componentWillMount() {
    this.props.fetchWelcomeText();
    this.props.checkIfUserLoggedIn();
    // this.props.logoutRequest();
  }

  _onLoginPressed = e => {
    this.props.navigation.navigate('LoginScreen');
  }

  _onRegistrationPressed = e => {
    this.props.navigation.navigate('RegisterScreen');
  }

  _onContinuePressed = e => {
    NavigationService.reset('main')
  }

  render() {
    const { theme } = this.props;
    return (
      <View style={[theme.palette.screen, { justifyContent: 'space-between' }]}>
        <Text style={[material.display1, { textAlign: 'center' }]}>{i18n.t('welcome_msg')}</Text>
        <View>
          <ScrollView>
            <Text style={material.body1}>
              {this.props.ui.welcome.verse}
            </Text>
            <Text style={material.body2}>{this.props.ui.welcome.title}</Text>
          </ScrollView>
        </View>

        {
          (() => {
            switch (this.props.ui.user_logged_in) {
              case 0:
                return (
                  <Text style={[material.title,{textAlign:'center'}]}>{i18n.t('loading')}</Text>
                );
              case 1:
                return (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button text={i18n.t('welcome_continue')} primary raised onPress={this._onContinuePressed} />
                  </View>
                )
              case -1:
                return (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button text={i18n.t('registration_title')} primary raised onPress={this._onRegistrationPressed} />
                    <Button text={i18n.t('login_title')} primary raised onPress={this._onLoginPressed} />
                  </View>
                )
            }
          })()
        }
      </View>
    )
  }
}


const mapStateToProps = (state) => ({
  ui: state.ui
})

const mapDispatchToProps = (dispatch) => ({
  fetchWelcomeText: (params) => dispatch(performAction(params, Types.WELCOME)),
  checkIfUserLoggedIn: params => dispatch(performAction(params, Types.CHECK_USER_LOGGEDIN)),
  logoutRequest: () => dispatch(performAction(undefined,Types.USER_LOGOUT)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(WelcomeScreen))