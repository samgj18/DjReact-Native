import React, { Component } from 'react'
import { View, ImageBackground, StyleSheet, Text } from 'react-native';

export default class BackgroundImage extends Component {

    render() {
        const { source, children } = this.props
        return (
            <ImageBackground
                source={source}
                style={styles.ImageContainer}
            >
                {children}
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    ImageContainer: {
        flex: 1,
        justifyContent:'center',
    },

})
