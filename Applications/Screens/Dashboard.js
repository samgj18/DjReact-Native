import React, { Component } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { connect } from 'react-redux';
import { Text } from 'react-native-elements'
import Toast, { DURATION } from 'react-native-easy-toast'
import { Icon } from 'react-native-elements'
import ModalDropdown from 'react-native-modal-dropdown';
import PreLoader from '../Components/PreLoader'
import DashboardList from '../Components/DashboardList'
import * as actions from '../Stores/Actions/auth'



class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }




  render() {
    if (this.props.loading) {
      return (
        <PreLoader />
      )
    } else {
      return (
        <View style={styles.MainContainer}>
          <View style={styles.UserHoover}>
            <Text h4
              style={{ alignSelf: 'center' }}
            >Activity Recognition</Text>
            <Text
              style={{ alignSelf: 'flex-start', paddingTop: 30 }}
            >
              La actividad que usted está realizando es: {this.props.activity}
            </Text>
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
  UserHoover: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: 50
  }
});

const mapStateToProps = state => {
  return {
    activity: state.auth.activity,
    loading: state.auth.loading,
  }
}


export default connect(mapStateToProps, null)(Dashboard)