import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'

class Historics extends Component {

    render() {
        return (
            <View>
                <Icon
                    reverse
                    name='leaf'
                    type='font-awesome'
                    color='rgba(58, 227, 116, 0.7)'
                    onPress={() => console.log('hello')} />
            </View>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Historics)
