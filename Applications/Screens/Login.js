import React, { Component } from 'react';
import { Card, Button, Image } from 'react-native-elements'
import { StyleSheet, View, Dimensions } from 'react-native'
import Toast, { DURATION } from 'react-native-easy-toast'
import Icon from 'react-native-vector-icons/FontAwesome';
import FormValidation from '../Utils/Validation';
import { connect } from 'react-redux';
import t from 'tcomb-form-native'
import * as  actions from '../Stores/Actions/auth'
import ResourceOne from '../Assets/Images/Resource1.png'
import ResourceTwo from '../Assets/Images/Resource2.png'

const { width, height } = Dimensions.get('window')
const Form = t.form.Form;

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {
                email: '',
                password: '',
                id: ''
            }
        }

        this.name = t.refinement(t.String, (s) => {
            return s !== ""
        })

        this.user = t.struct({
            name: this.name,
            password: FormValidation.password,
        })
        this.options = {
            fields: {
                name: {
                    label: 'Usuario',
                    help: 'Introduce tu usuario',
                    error: 'Introduce un usuario válido',
                    autoCapitalize: 'none',
                },
                password: {
                    label: 'Contraseña',
                    help: 'Introduce una contraseña',
                    error: 'Introduce una contraseña válida',
                    password: true,
                    secureTextEntry: true,
                }
            }
        }
        this.validate = null;
    }

    /* tcomb-form-native is the library that allows us to create forms in a faster way only by setting the structure
    and the options of the form we want to create. In this particular case, we want a login form with Email & Pass */
    static navigationOptions = { title: '🇨🇴' };

    gotoUserScreen = () => {
        this.props.navigation.navigate('LandScreen', {
            email: this.state.user.email,
        });
    }
    /* HomeScreen inheritance, no need of createSwitchNavigator or createStackNavigator. */

    async login() {
        if (this.validate) {
            this.props.onAuth(this.validate.name, this.validate.password);
        }
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
            <View style={styles.MainContainer}>
                <View style={styles.BackImageOne}>
                    <Image
                        source={ResourceTwo}
                        style={{ width: 100, height: 100, alignSelf: 'center' }}
                    />
                </View>

                <Card
                    wrapperStyle={{ paddingLeft: 10 }}
                    title='Ingresa'
                >
                    <Form
                        ref="form"
                        type={this.user}
                        options={this.options}
                        onChange={(v) => this.onChange(v)}
                        value={this.state.user}
                    />
                </Card>
                <View style={styles.Button}>
                    <Button
                        icon={
                            <Icon
                                name='sign-in'
                                size={25}
                                color='#F0700A'
                            />
                        }
                        title="Entrar"
                        onPress={this.login.bind(this)}
                        type='clear'
                    />
                </View>
                <View style={styles.BackImageTwo}>
                    <Image
                        source={ResourceOne}
                        style={{ width: width, height: height, alignSelf: 'center' }}
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
            </View>

        )
    }
}



const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, password) => dispatch(actions.authLogin(username, password))
    }
}
const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    Button: {
        flex: 0.5,
        paddingTop: 30,
    },
    BackImageOne: {
        flex: 1,
    },
    BackImageTwo: {
        flex: 1,
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)

