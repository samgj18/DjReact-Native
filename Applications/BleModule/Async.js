import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Button } from 'react-native-elements';

class Async extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount = () => {
        AsyncStorage.removeItem('databaseTest');
    }
    ingresardatos = () => {
        let btInfo = {
            "voltage_coil_1": `1`,
            "voltage_coil_2": `1`,
            "voltage_generated_by_user": `1`,
            "activity": `1`
        }
        AsyncStorage.getItem('databaseTest').then((value) => {
            let existingData = JSON.parse(value)
            if (!existingData) {
                existingData = []
            }
            existingData.push(btInfo)
            AsyncStorage.setItem('databaseTest', JSON.stringify(existingData))
                .then(() => {
                    console.log(existingData)
                })
                .catch(() => {
                    console.log('There was an error saving the product')
                })
        })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <View style={styles.MainContainer}>
                <View style={styles.boxOne}>
                    <Button
                        onPress={this.ingresardatos.bind(this)}
                        title='PRESIONAR'
                    />
                </View>
            </View>

        );
    }
}
const styles = StyleSheet.create({

    MainContainer: {

        flex: 1,
    },
    boxOne: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 11,
    },
});

export default Async;