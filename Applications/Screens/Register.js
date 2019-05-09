import React, { Component } from 'react'
import { Card, Button, Text, Image } from 'react-native-elements'
import Toast, { DURATION } from 'react-native-easy-toast'
import Icon from 'react-native-vector-icons/FontAwesome';
import t from 'tcomb-form-native'
import { NavigationActions } from 'react-navigation'
import { StyleSheet, View, ScrollView } from 'react-native'
import { connect } from 'react-redux';
import FormValidation from '../Utils/Validation'
import * as actions from '../Stores/Actions/auth'
import ResourceTwo from '../Assets/Images/Resource2.png'

const Form = t.form.Form;

class Register extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {
                nombre: '',
                email: '',
                password: ''
            },
        }
        this.samepassword = t.refinement(t.String, (s) => {
            return s === this.state.user.password
        })
        this.name = t.refinement(t.String, (s) => {
            return s !== ""
        })

        this.user = t.struct({
            name: this.name,
            email: FormValidation.email,
            password: FormValidation.password,
            password_confirmation: this.samepassword
        })
        this.options = {
            fields: {
                name: {
                    label: 'Usuario',
                    help: 'Introduce tu usuario',
                },
                email: {
                    label: 'Correo',
                    help: 'Introduce un correo',
                    error: 'Introduce un correo válido',
                    autoCapitalize: 'none',
                },
                password: {
                    label: 'Contraseña',
                    help: 'Introduce una contraseña',
                    error: 'Introduce una contraseña válida',
                    password: true,
                    secureTextEntry: true,
                },
                password_confirmation: {
                    label: 'Confirme contraseña',
                    help: 'Repite la contraseña',
                    error: 'Las contraseñas no coinciden',
                    password: true,
                    secureTextEntry: true
                }
            }
        }
        this.validate = null;
    }

    /* tcomb-form-native is the library that allows us to create forms in a faster way only by setting the structure
    and the options of the form we want to create. In this particular case, we want a login form with Email & Pass */
    static navigationOptions = { title: '🇨🇴' };

    gotoLogin = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'Login'
        })
        this.props.navigation.dispatch(navigateAction)
    }

    register() {
        this.props.onAuth(this.validate.name, this.validate.email, this.validate.password, this.validate.password);
        this.refs.toast.show('Iniciando Sesión', DURATION.LENGTH_LONG);
    }

    /* React Native provides the Fetch API for your networking needs. 
    Fetch will seem familiar if you have used XMLHttpRequest or other networking APIs before
    Fetch also takes an optional second argument that allows you to customize the HTTP request.
    You may want to specify additional headers, or make a POST request like the one is done here.  */

    onChange(user) {
        this.setState({ user });
        this.validate = this.refs.form.getValue();
    }

    /* This onChange function is the core of React concept, *states*. 
   There are two types of data that control a component: props and state. props are set by the parent 
   and they are fixed throughout the lifetime of a component. For data that is going to change, we have to use state.
   In general, you should initialize state in the constructor, and then call setState when you want to change it. */




    render() {
        return (
            <ScrollView style={styles.MainContainer}>
                <Image
                    source={ResourceTwo}
                    style={{ width: 60, height: 60, alignSelf: 'center' }}
                />
                <Card
                    wrapperStyle={{ paddingLeft: 10 }}
                    title='Regístrate'
                >
                    <View>
                        <Form
                            ref="form"
                            type={this.user}
                            options={this.options}
                            onChange={(v) => this.onChange(v)}
                            value={this.state.user}
                        />
                    </View>


                </Card>
                <View style={styles.Button}>
                    <Button
                        icon={
                            <Icon
                                name='connectdevelop'
                                size={25}
                                color='#F0700A'
                            />
                        }
                        title='Regístrame'
                        onPress={this.register.bind(this)}
                        type='clear'
                    />
                </View>
                <View style={styles.Login}>
                    <Text style={styles.Text}>
                        ¿Ya tienes una cuenta?
                    </Text>
                    <Button
                        icon={
                            <Icon
                                name='sign-in'
                                size={25}
                                color='#F0700A'
                            />
                        }
                        title='Inicia Sesión'
                        onPress={this.gotoLogin.bind(this)}
                        type='clear'
                    />
                </View>
                <Toast
                    ref="toast"
                    style={{ backgroundColor: 'transparent' }}
                    position='top'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: 'black' }}
                />
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, email, password1, password2) => dispatch(actions.authSignUp(username, email, password1, password2))
    }
}



const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
    },
    Button: {
        paddingTop: 10
    },
    Login: {
        paddingTop: 10,
        alignItems: 'center'
    },
    Text: {
        fontSize: 20
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(Register)