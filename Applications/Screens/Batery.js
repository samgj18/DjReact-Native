import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'

export class Batery extends Component {

    render() {
        return (
            <View>
                <Icon
                    reverse
                    name='send'
                    type='font-awesome'
                    color='#2f3542'
                    onPress={() => console.log('hello')} />
            </View>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Batery)
