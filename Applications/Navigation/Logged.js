import React from 'react'
import Ble from '../BleModule/Ble'
import UserScreen from '../Screens/UserScreen'
import Batery from '../Screens/Batery'
import Historics from '../Screens/Historics'
import { Icon } from 'react-native-elements'
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";


const DashboardTabNavigator = createMaterialBottomTabNavigator({
  Dashboard: {
    screen: UserScreen,
    navigationOptions: {
      title: 'Dashboard',
      tabBarLabel: 'Dashboard',
      tabBarIcon: <Icon size={24} color="white" name="tv" />
    }
  },
  Settings: {
    screen: Ble,
    navigationOptions: {
      title: 'Settings',
      tabBarLabel: 'Settings',
      tabBarIcon: <Icon size={24} color="white" name="settings" />
    }
  },
  Historics: {
    screen: Historics,
    navigationOptions: {
      title: 'Historics',
      tabBarLabel: 'Historics',
      tabBarIcon: <Icon size={24} color="white" name="history" />
    }
  },
  Batery: {
    screen: Batery,
    navigationOptions: {
      title: 'Battery',
      tabBarLabel: 'Battery',
      tabBarIcon: <Icon size={24} color="white" name="battery-full" />
    }
  }
}, {
    initialRouteName: 'Dashboard',
    activeColor: '#ecf0f1',
    inactiveColor: '#dff9fb',
    barStyle: { backgroundColor: '#F0700A' },
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index]
      return {
        headerTitle: routeName
      }
    }
  });

/* const DashboardStackNavigator = createStackNavigator({
  DashboardTabNavigator: DashboardTabNavigator
}) */



export default createAppContainer(DashboardTabNavigator);

