import React from 'react'
import Ble from '../BleModule/Ble'
import Dashboard from '../Screens/Dashboard'
import Batery from '../Screens/Batery'
import Historics from '../Screens/Historics'
import UserProfile from '../Screens/UserProfile'
import { Icon } from 'react-native-elements'
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";


const DashboardTabNavigator = createMaterialBottomTabNavigator({
  Dashboard: {
    screen: Dashboard,
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
  },
  UserProfile: {
    screen: UserProfile,
    navigationOptions: {
      title: 'Profile',
      tabBarLabel: 'Profile',
      tabBarIcon: <Icon size={24} color="white" name="person-outline" />
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

