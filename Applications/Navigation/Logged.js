import Ble from '../BleModule/Ble'
import UserScreen from '../Screens/UserScreen'
import { createAppContainer, createStackNavigator } from 'react-navigation';

const UserScreenStack = createStackNavigator(
  {
    LandScreen: {
      screen: UserScreen
    },
    BleScreen: {
      screen: Ble
    }
  }
);


export default createAppContainer(UserScreenStack);

