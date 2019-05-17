import React, { Component } from 'react'
import { View, StyleSheet, TextInput, Button, ScrollView } from 'react-native'
import { connect } from 'react-redux';
import { Text } from 'react-native-elements'
import Toast, { DURATION } from 'react-native-easy-toast'
import { Icon } from 'react-native-elements'
import ModalDropdown from 'react-native-modal-dropdown';
import * as actions from '../Stores/Actions/auth'




class UserProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            user: false,
            dropdown: true
        }
        this.counter = 0
    }

    changeUserName = async () => {
        try {
            let config = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.props.token}`
                },
                body: JSON.stringify({
                    username: this.state.username,
                    first_name: this.state.firstName,
                    last_name: this.state.lastName
                })
            }
            const URL = 'http://72.14.177.247/rest-auth/user/'
            const response = await fetch(URL, config)
            const responseJson = await response.json()
            console.log(responseJson)
            if (responseJson.first_name == this.state.firstName) {
                this.setState({
                    user: true,
                }, () => {
                    console.log(this.state.user)
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    async componentDidMount() {
        try {
            let config = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.props.token}`
                },
            }
            const URL = 'http://72.14.177.247/rest-auth/user/'
            const response = await fetch(URL, config)
            const responseJson = await response.json()
            console.log(responseJson)
            this.setState({
                firstName: responseJson.first_name,
            }, () => {
                if (responseJson.first_name != '') {
                    this.setState({
                        user: true
                    }, () => {
                        console.log(this.state.user)
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    gotoDashboard() {
        this.props.navigation.navigate('Landing');
    }

    dropdownShow() {
        this.dropdown && this.dropdown.show();
        this.setState({
            dropdown: false
        })
    }

    dropdownHide() {
        this.dropdown.hide();
        this.setState({
            dropdown: true
        })
    }

    dropdownOnSelect(idx) {
        this.dropdownIdx = idx;
        if (this.dropdownIdx == 0) {
            this.refs.toast.show('Cerrando sesión', DURATION.LENGTH_LONG);
            this.props.onAuth()
            this.gotoDashboard();
        }
    }

    render() {
        const dropdownShowOrHide = this.state.dropdown ? this.dropdownShow.bind(this) : this.dropdownHide.bind(this);
        if (this.state.user) {
            return (
                <ScrollView style={styles.MainContainer}>
                    <View style={styles.UserHoover}>
                        <Text h4
                            style={{ alignSelf: 'center' }}
                        >Hola de nuevo {this.state.firstName}</Text>
                        <View style={{ paddingTop: 30 }}>
                            <Text
                                style={{ alignSelf: 'center' }}
                            >Recuerda que : </Text>
                            <Icon size={24} color="black" name="home" />
                            <Text
                                style={{ alignSelf: 'center' }}
                            >es el lugar donde estás</Text>
                        </View>
                        <View style={{ paddingTop: 30 }}>
                            <Icon size={24} color="black" name="history" />
                            <Text
                                style={{ alignSelf: 'center' }}
                            >¡Puedes consultar las actividades realizadas y el voltaje entregado!</Text>
                        </View>
                        <View style={{ paddingTop: 30 }}>
                            <Icon size={24} color="black" name="tv" />
                            <Text
                                style={{ alignSelf: 'center' }}
                            >¡Podrás ver la actividad que detectamos de ti!</Text>
                        </View>
                        <View style={{ paddingTop: 30 }}>
                            <Icon size={24} color="black" name="settings" />
                            <Text
                                style={{ alignSelf: 'center' }}
                            >¡Podrás conectarte con el módulo BLE!</Text>
                        </View>
                        <View style={{ paddingTop: 30 }}>
                            <Icon size={24} color="black" name="battery-full" />
                            <Text
                                style={{ alignSelf: 'center' }}
                            >¡Podrás consultar la energía entregada a la batería!</Text>
                        </View>
                        <View style={{ paddingTop: 40 }}>
                            <Icon
                                reverse
                                name='ellipsis-h'
                                type='font-awesome'
                                color='black'
                                onPress={dropdownShowOrHide}
                            />
                            <ModalDropdown ref={el => this.dropdown = el}
                                defaultValue=''
                                options={['Cerrar sesión']}
                                onSelect={this.dropdownOnSelect.bind(this)}
                            />
                        </View>
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
        } else {
            return (
                <View style={styles.MainContainerSecondary}>

                    <Text h4
                        style={{ alignSelf: 'center' }}
                    >Solo un paso más </Text>

                    <TextInput
                        placeholder="Ingresa tu usuario"
                        onChangeText={username => this.setState({ username })}
                        underlineColorAndroid='transparent'
                        style={styles.TextInputStyleClass}
                    />

                    <TextInput
                        placeholder="Ingresa tu nombre"
                        onChangeText={firstName => this.setState({ firstName })}
                        underlineColorAndroid='transparent'
                        style={styles.TextInputStyleClass}
                    />

                    <TextInput
                        placeholder="Ingresa tu apellido"
                        onChangeText={lastName => this.setState({ lastName })}
                        underlineColorAndroid='transparent'
                        style={styles.TextInputStyleClass}
                    />
                    <Button title='¡Enviar!' onPress={this.changeUserName.bind(this)} color="#2196F3" />
                </View>
            )
        }
    }
}

/* This is the Component that User is redirected to when the successfully login or register passing all
the forms validations and connecting to database */

const styles = StyleSheet.create({

    MainContainer: {
        flex: 1,
        padding: 11
    },
    MainContainerSecondary: {
        justifyContent: 'center',
        flex: 1,
        margin: 10,
    },
    UserHoover: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50
    },
    UserLogout: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    TextInputStyleClass: {

        textAlign: 'center',
        marginBottom: 7,
        height: 40,
        borderWidth: 1,
        borderColor: '#2196F3',
        borderRadius: 5,
    },
});

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        loading: state.auth.loading,
        id: state.auth.id
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: () => dispatch(actions.logout())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)