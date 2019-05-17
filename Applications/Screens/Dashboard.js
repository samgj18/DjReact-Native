import React, { Component } from 'react'
import { View, StyleSheet, Image } from 'react-native'
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
    let image1 = <Image
      style={{ width: 100, height: 100, borderRadius: 10 }}
      source={{ uri: 'https://www.wikihow.com/images_en/thumb/2/25/Hula-Hoop-Step-7-Version-10.jpg/550px-nowatermark-Hula-Hoop-Step-7-Version-10.jpg' }}
    />
    let image2 = <Image
      style={{ width: 100, height: 100, borderRadius: 10 }}
      source={{ uri: 'https://www.euroresidentes.com/suenos/img_suenos/saltar-suenos-euroresidentes.jpg' }}
    />
    let image3 = <Image
      style={{ width: 100, height: 100, borderRadius: 10 }}
      source={{ uri: 'https://www.besthealthmag.ca/wp-content/uploads/sites/16/2018/04/Run-club-woman-running.jpg' }}
    />
    let image4 = <Image
      style={{ width: 100, height: 100, borderRadius: 10 }}
      source={{ uri: 'https://cdni.rt.com/actualidad/public_images/2018.01/article/5a66fa19e9180f035b8b4567.jpg' }}
    />
    let image5 = <Image
      style={{ width: 100, height: 100, borderRadius: 10 }}
      source={{ uri: 'https://cdn-3.expansion.mx/dims4/default/8ed2d9a/2147483647/strip/true/crop/1254x836+0+0/resize/800x533!/quality/90/?url=https%3A%2F%2Fcdn-3.expansion.mx%2Fe7%2F4a%2F516e79804ba1832e52c1532d2a1b%2Fistock-701263280.jpg' }}
    />
    let image = <Image
      style={{ width: 100, height: 100, borderRadius: 10 }}
      source={{ uri: 'https://pbs.twimg.com/media/DUupQHIU8AAJj24.jpg' }}

    />

    if (this.props.activity == 0) {
      activity = 'Torso'
      image = image1
    } else if (this.props.activity == 1) {
      activity = 'Saltar'
      image = image2
    } else if (this.props.activity == 2) {
      activity = 'Correr'
      image = image3
    } else if (this.props.activity == 3) {
      activity = 'Estar quieto'
      image = image4
    } else if (this.props.activity == 4) {
      activity = 'Caminar'
      image = image5
    } else {
      activity = 'Reconociendo actividad...'
      image
    }

    if (this.props.loading) {
      return (
        <PreLoader />
      )
    } else {
      return (
        <View style={styles.MainContainer}>
          <View style={styles.UserHoover}>

            <Text h1
              style={{ textAlign: 'center' }}
            >
              {activity}

            </Text>
            {image}
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
    alignItems: 'center',
    paddingTop: 50,
    justifyContent: 'center'

  }
});

const mapStateToProps = state => {
  return {
    activity: state.auth.activity,
    loading: state.auth.loading,
  }
}


export default connect(mapStateToProps, null)(Dashboard)