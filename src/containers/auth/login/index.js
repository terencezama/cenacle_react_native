import React, { Component } from 'react'
import { Text, View, Keyboard } from 'react-native'
import { TextField } from 'react-native-material-textfield'
import { Formik } from 'formik';
import { withTheme, Button, Card } from 'react-native-material-ui'
import { i18n } from '../../../services';
import { ScrollView } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { performAction, Types } from '../../../state';
import { Screen } from '../../../components';
import { request } from '../../../state/types';
const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email(i18n.t('validation_invalid_email'))
        .required(i18n.t('validation_required')),
    password: Yup.string()
        .min(6, i18n.t('validation_too_short'))
        .required(i18n.t('validation_required')),
});
class LoginScreen extends Component {
    static navigationOptions = {
        title: i18n.t('login_title'),
    };

    state = {
        loading: false
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { user_login } = this.props;
        if (user_login !== prevProps.user_login && !user_login.fetching) {
            this.formik.setSubmitting(false);
            if (this.state.loading) {
                this.setState({ loading: false });
            }
        }
    };


    _onForgotPressed = e => {
        Keyboard.dismiss();
        this.props.navigation.navigate('ForgotScreen');
    }

    _onSubmit = values => {
        this.setState({ loading: true })
        Keyboard.dismiss();
        this.props.loginRequest(values);
    }

    render() {
        const { loading } = this.state;
        return (
            <Screen loading={loading}>
                <ScrollView keyboardShouldPersistTaps={'handled'} style={this.props.theme.palette.screen}>
                    <View>
                        <Formik
                            initialValues={{
                                email: '',
                                password: '',

                            }}
                            onSubmit={this._onSubmit}
                            validationSchema={LoginSchema}
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
                                    <TextField
                                        onChangeText={props.handleChange('password')}
                                        onBlur={props.handleBlur('password')}
                                        value={props.values.password}
                                        label={i18n.t('field_password')}
                                        secureTextEntry
                                        error={props.touched.password ? props.errors.password : undefined}
                                    />
                                    <Button onPress={props.handleSubmit} raised primary text={i18n.t('login_submit')} disabled={props.isSubmitting || !props.isValid} />
                                    <Button text={i18n.t('forgot_title')} style={{ container: { marginTop: 20 } }} primary onPress={this._onForgotPressed} />
                                </View>
                            )}
                        </Formik>
                    </View>
                </ScrollView>
            </Screen>
        )
    }
}

// export default withTheme(LoginScreen)
const mapStateToProps = (state) => ({
    ui: state.ui,
    user_login: state.user_login
})

const mapDispatchToProps = (dispatch) => ({
    loginRequest: (params) => dispatch(performAction(params, request(Types.USER_LOGIN)))
})
// export default withTheme(BibleBookView)
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(LoginScreen))