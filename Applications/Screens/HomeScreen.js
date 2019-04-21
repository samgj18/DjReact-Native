import React, { Component } from 'react'
import { StyleSheet, View, Linking } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Button, Image } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreenImage from '../Assets/Images/HomeScreen.png'
import LoginImage from '../Assets/Images/Login.png'
import BackgroundImage from '../Utils/BackgroundImage';


export default class HomeScreen extends Component {

  static navigationOptions = { title: 'Inicio', header: null };
  /*This is the header of the HomeScreen, title sets the caption on the top Screen */

  gotoRegister = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'Register'
    })
    this.props.navigation.dispatch(navigateAction)
  }

  gotoLogin = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'Login'
    })
    this.props.navigation.dispatch(navigateAction)
  }

  /* gotoRegister and gotoLogin is the function that allows to move between the HomeScreen Component to
   the Register component by pressing the "Register Button" & "Login Button". 
   This.props.navigation.navigate("Name_associated_with_Component") is the syntax of React-Navigation 
   Library for navigating through Screens. */

  render() {
    return (
      <BackgroundImage source={LoginImage}>
        <View style={styles.MainContainer}>
          <View style={styles.AppImage}>
            <Image
              source={HomeScreenImage}
              style={{ width: 400, height: 400 }}
            />
          </View>
          <View style={styles.MainButtonContainer}>
            <View style={styles.Espaciamiento}>
              <Button
                icon={
                  <Icon
                    name='sign-in'
                    size={30}
                    color='rgba(58, 227, 116, 0.7)'
                  />
                }
                title="Entrar"
                onPress={this.gotoLogin}
                type='outline'
                raised
              />
            </View>
            <View style={styles.Espaciamiento}>
              <Button
                icon={
                  <Icon
                    name='connectdevelop'
                    size={30}
                    color='rgba(58, 227, 116, 0.7)'
                  />
                }
                title="Registrarse"
                onPress={this.gotoRegister}
                type='outline'
                raised
              />
            </View>

          </View>
          <View style={styles.UrlButtonContainer}>
            <Button
              title="Visita la página web de la universidad"
              onPress={() => Linking.openURL('https://www.uninorte.edu.co/web/ingenieria-electronica/conoce-tu-carrera')}
            />
          </View>
        </View>
      </BackgroundImage>
      /*The render() method is a reserved React function which, as is seen, contains the visual 
      element of the Component*/
    );
  }
}



const styles = StyleSheet.create({

  MainContainer: {

    flex: 1,
    justifyContent: 'center',
    padding: 11

  },
  AppImage: {
    flex: 4,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  MainButtonContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',

  },
  Espaciamiento: {
    width: "40%"
  },
  UrlButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});