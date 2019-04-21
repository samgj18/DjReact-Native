import React, { Component } from 'react'
import { StyleSheet, Dimensions, View, ActivityIndicator } from 'react-native';



export default class Preloader extends Component {
    render(){
        return(
        <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="#7bed9f" />
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center'
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    }
  })


  /* This component is made, as it name indicates, a Pre Loader between Components
  whenever a Component is called, the PreLoader will appear before charging the Screen
  or the Component *Is not been used yet* */