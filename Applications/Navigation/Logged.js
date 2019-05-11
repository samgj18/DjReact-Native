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
      tabBarIcon: <Icon size={24} color="#EAF7CF" name="tv" />
    }
  },
  Settings: {
    screen: Ble,
    navigationOptions: {
      title: 'Settings',
      tabBarLabel: 'Settings',
      tabBarIcon: <Icon size={24} color="#EAF7CF" name="settings" />
    }
  },
  Historics: {
    screen: Historics,
    navigationOptions: {
      title: 'Historics',
      tabBarLabel: 'Historics',
      tabBarIcon: <Icon size={24} color="#EAF7CF" name="history" />
    }
  },
  Batery: {
    screen: Batery,
    navigationOptions: {
      title: 'Battery',
      tabBarLabel: 'Battery',
      tabBarIcon: <Icon size={24} color="#EAF7CF" name="battery-full" />
    }
  }
}, {
    initialRouteName: 'Dashboard',
    activeColor: '#FFF',
    inactiveColor: '#C19AB7',
    barStyle: { backgroundColor: '#C19AB7' },
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

