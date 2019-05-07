import React, { Component } from 'react'
import { StyleSheet, ImageBackground, Image } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Text, View } from 'react-native-animatable'
import Seed from '../Assets/Images/Icon1.png'
import Sketch from '../Assets/Images/Icon2.png'



export default class Landing extends Component {

    gotoRegister = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'Register'
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
                >
                    <Image
                        style={{ width: 200, height: 180 }}
                        source={Sketch}
                    />
                </View>
                <View style={styles.BoxTwo}>
                    <ImageBackground
                        style={styles.BackImage}
                        source={Seed}
                    >
                        <Text
                            animation='pulse' 
                            delay={3000}
                            style={[styles.Title]}
                            onPress={this.gotoRegister.bind(this)}
                        >¡Iniciemos!</Text>
                    </ImageBackground>
                </View>

            </View>
        )
    }
}


const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
    },
    BoxOne: {
        flex: 1,
        paddingTop: 60,
        alignItems: 'center',
    },
    BoxTwo: {
        flex: 3,
        position: 'relative'
    },
    Title: {
        fontSize: 25,
        color: 'white',
        textAlign: 'center',
        paddingBottom: 30
    },
    BackImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end'
    }
})