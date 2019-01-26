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

const RegisterSchema = Yup.object().shape({
    nickname: Yup.string()
        .required(i18n.t('validation_required')),
    email: Yup.string()
        .email(i18n.t('validation_invalid_email'))
        .required(i18n.t('validation_required')),
    password: Yup.string()
        .min(6, i18n.t('validation_too_short'))
        .required(i18n.t('validation_required')),
    mobile: Yup.number()
        .min(7, i18n.t('validation_mobile'))
        .required(i18n.t('validation_required')),
});

class RegisterScreen extends Component {
    static navigationOptions = {
        title: i18n.t('registration_title'),
    };

    state = {
        loading: false
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { user_register } = this.props;
        if (user_register !== prevProps.user_register && !user_register.fetching) {
            this.formik.setSubmitting(false);
            if (this.state.loading) {
                this.setState({ loading: false });
            }
        }
    }


    _onSubmit = values => {
        this.setState({ loading: true })
        Keyboard.dismiss();
        this.props.registerRequest(values);
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
                            validationSchema={RegisterSchema}
                            onSubmit={this._onSubmit}
                            ref={(ref) => { this.formik = ref; }}
                        >
                            {props => (
                                <View>
                                    <TextField
                                        onChangeText={props.handleChange('nickname')}
                                        onBlur={props.handleBlur('nickname')}
                                        value={props.values.nickname}
                                        label={i18n.t('field_nickname')}
                                        error={props.touched.nickname ? props.errors.nickname : undefined}

                                    />
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
                                    <TextField
                                        onChangeText={props.handleChange('mobile')}
                                        onBlur={props.handleBlur('mobile')}
                                        value={props.values.mobile}
                                        label={i18n.t('field_mobile')}
                                        error={props.touched.mobile ? props.errors.mobile : undefined}

                                    />
                                    <Button onPress={props.handleSubmit} raised primary text={i18n.t('registration_submit')} disabled={props.isSubmitting || !props.isValid} />
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
    user_register: state.user_register
})

const mapDispatchToProps = (dispatch) => ({
    registerRequest: (params) => dispatch(performAction(params, request(Types.USER_REGISTER)))
})
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(RegisterScreen))