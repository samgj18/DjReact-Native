import React, { Component } from 'react'
import { StyleSheet, Image } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Text, View } from 'react-native-animatable'
import Sketch from '../Assets/Images/BackgroundIcon.png'



export default class Landing extends Component {

    gotoRegister = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'Login'
        })
        this.props.navigation.dispatch(navigateAction)
    }
    static navigationOptions = { header: null };

    render() {
        return (
            <View style={styles.MainContainer}>
                <View style={styles.BoxOne}
                    animation='pulse'
                    delay={3000}
                    iterationCount='infinite'
                >
                    <Image
                        style={{ width: 200, height: 180 }}
                        source={Sketch}
                    />
                </View>
                <View style={styles.BoxTwo}>
                    <Text
                        animation='pulse'
                        delay={3000}
                        style={[styles.Title]}
                        onPress={this.gotoRegister.bind(this)}
                    >¡Presiona para iniciar!</Text>

                </View>

            </View>
        )
    }
}


const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#CFFCFF'
    },
    BoxOne: {
        flex: 1,
        paddingTop: 60,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    BoxTwo: {
        flex: 1,
        justifyContent: 'center'
    },
    Title: {
        fontSize: 25,
        textAlign: 'center',
        paddingBottom: 30,
        color: '#1C1612',
    },
})