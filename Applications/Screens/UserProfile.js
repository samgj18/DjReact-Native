import React, { Component } from 'react'
import { View, StyleSheet, TextInput, Button } from 'react-native'
import { connect } from 'react-redux';
import { Text } from 'react-native-elements'
import Toast, { DURATION } from 'react-native-easy-toast'
import { Icon } from 'react-native-elements'
import ModalDropdown from 'react-native-modal-dropdown';
import PreLoader from '../Components/PreLoader'
import DashboardList from '../Components/DashboardList'
import * as actions from '../Stores/Actions/auth'



class UserProfile extends Component {
    constructor(props) {
        super(props)


        this.state = {
            articles: '',
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

    async componentDidUpdate(prevProps, prevState) {
        if (this.state.user && this.counter == 0) {
            try {
                this.refs.toast.show('Cargando información de interes', DURATION.LENGTH_SHORT);
                let config = {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
                const URL = 'https://newsapi.org/v2/top-headlines?country=co&category=science&apiKey=0a4c95a16be648e8be07e265bbc31af2'
                const response = await fetch(URL, config)
                const responseJson = await response.json()
                this.counter = this.counter + 1
                this.setState({
                    articles: responseJson.articles
                })
            } catch (error) {
                console.log(error)
            }

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
                <View style={styles.MainContainer}>
                    <View style={styles.UserHoover}>
                        <Text h4
                            style={{ alignSelf: 'center' }}
                        >Hola de nuevo {this.state.firstName}</Text>
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
                        <DashboardList style={{ paddingTop: 20 }} articles={this.state.articles} />
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
        alignItems: 'flex-end',
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