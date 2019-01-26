import React, { Component } from 'react'
import { Text, View, Keyboard } from 'react-native'
import { TextField } from 'react-native-material-textfield'
import { Formik } from 'formik';
import { withTheme, Button, Card } from 'react-native-material-ui'
import { i18n } from '../../../services';
import { connect } from 'react-redux';
import { performAction, Types } from '../../../state';
import { request } from '../../../state/types';
import * as Yup from 'yup';
import { Screen } from '../../../components';

const ForgotSchema = Yup.object().shape({
    email: Yup.string()
        .email(i18n.t('validation_invalid_email'))
        .required(i18n.t('validation_required')),
});
class ForgotScreen extends Component {
    static navigationOptions = {
        title: i18n.t('forgot_title'),

    };

    state = {
        loading: false
    }

    componentDidUpdate = (prevProps, prevState) => {
      const {user_forgotpassword} = this.props;
      if(user_forgotpassword !== prevProps.user_forgotpassword && !user_forgotpassword.fetching){
          this.formik.setSubmitting(false);
          if(this.state.loading){
              this.setState({loading:false});
          }
      }
    }
    
    _onSubmit = values => {
        this.setState({ loading: true })
        Keyboard.dismiss();
        this.props.forgotRequest(values);
    }
    
    render() {
        const { loading } = this.state;
        return (
            <Screen loading={loading}>
                <View style={this.props.theme.palette.screen}>
                    <View>
                        <Formik
                            initialValues={{
                                nickname: '',
                                email: '',
                                password: '',
                                mobile: ''

                            }}
                            onSubmit={this._onSubmit}
                            validationSchema={ForgotSchema}
                            ref={(ref) => { this.formik = ref; }}
                        >
                            {props => (
                                <View>
                                    <TextField
                                        onChangeText={props.handleChange('email')}
                                        onBlur={props.handleBlur('email')}
                                        value={props.values.email}
                                        label={i18n.t('field_email')}
                                        error={props.touched.email ? props.errors.email : undefined}

                                    />
                                    <Button onPress={props.handleSubmit} raised primary text={i18n.t('forgot_submit')} disabled={props.isSubmitting || !props.isValid} />
                                </View>
                            )}
                        </Formik>
                    </View>
                </View>
            </Screen>
        )
    }
}

const mapStateToProps = (state) => ({
    ui: state.ui,
    user_forgotpassword: state.user_forgotpassword
})

const mapDispatchToProps = (dispatch) => ({
    forgotRequest: (params) => dispatch(performAction(params, request(Types.USER_FORGOTPASSWORD)))
})
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ForgotScreen))