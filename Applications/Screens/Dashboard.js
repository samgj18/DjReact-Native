import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import { Text } from 'react-native-elements'
import Toast, { DURATION } from 'react-native-easy-toast'
import PreLoader from '../Components/PreLoader'

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
    this.activity
  }

  render() {
    let activity = ''

    if (this.props.activity == 0) {
      activity = 'Torso'
    } else if (this.props.activity == 1) {
      activity = 'Saltar'
    } else if (this.props.activity == 2) {
      activity = 'Correr'
    } else if (this.props.activity == 3) {
      activity = 'Estar quieto'
    } else if (this.props.activity == 4) {
      activity = 'Subir o bajar escaleras'
    }

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
              La actividad que usted está realizando es: {activity}
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