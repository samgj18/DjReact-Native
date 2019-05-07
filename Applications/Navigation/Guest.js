import Landing from '../Screens/Landing'
import LoginScreen from '../Screens/Login'
import RegisterScreen from '../Screens/Register'
import { createAppContainer, createStackNavigator } from 'react-navigation';



const RootStack = createStackNavigator(
  {
    Landing: {
      screen: Landing
    },
    Login: {
      screen: LoginScreen
    },
    Register: {
      screen: RegisterScreen
    },
  }
);



export default createAppContainer(RootStack);
/* React Native concept is to create Single Apps Apliccations, in other words,
just one screen for the whole project and re-rendering according to the needs
of the User. This Component is made for re-directing to the HomeScreen
Component which is the one that contains all the first screen logic */