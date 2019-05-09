import React, { Component } from 'react'
import { View, StyleSheet, Button } from 'react-native'
import { Text } from 'react-native-elements'
import { connect } from 'react-redux';
import Toast, { DURATION } from 'react-native-easy-toast'
import PreLoader from '../Components/PreLoader'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { Icon } from 'react-native-elements'

import { fetchDataFromServer } from '../BleModule/BleUtils'



class Historics extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isDateTimePickerVisible: false,
            initialDatePicked: '',
            endDatePicked: '',
            header: 'Selecciona la fecha inicial'
        }
        this.counter = 0
    }
    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDateRange = (date) => {
        if (this.counter === 0) {
            this.setState({
                initialDatePicked: date,
                header: 'Selecciona la fecha final'
            }, () => {
                console.log(this.state.initialDatePicked)
                this.counter = this.counter + 1
                this.showDateTimePicker()
                this.refs.toast.show('Selecciona fecha final', DURATION.LENGTH_SHORT)
            })
        } else {
            this.setState({
                endDatePicked: date,
                header: '¡Realiza la consulta con el botón de abajo!'
            }, () => {
                console.log(this.state.endDatePicked)
                this.hideDateTimePicker()
                this.counter = 0
            })
        }
    }

    handleDatePicked = (datetime) => {
        let curr_date = datetime.getDate();
        let curr_month = datetime.getMonth();
        let curr_year = datetime.getFullYear();
        let mydatestr = curr_year + ',' +
            curr_month + ',' +
            curr_date
        this.setState({
            header: 'Seleccione la fecha inicial'
        }, () => {
            this.hideDateTimePicker()
            this.handleDateRange(mydatestr)
        })
    }





    render() {
        const { initialDatePicked, endDatePicked } = this.state
        if (this.props.loading) {
            return (
                <PreLoader />
            )
        } else {
            return (
                <View style={styles.MainContainer}>
                    <View style={styles.Historics}>
                        <Text h4>Consulta de Históricos</Text>
                        <Text> {this.state.header} </Text>
                        <Icon
                            reverse
                            name='calendar'
                            type='font-awesome'
                            color='black'
                            onPress={this.showDateTimePicker}
                        />
                        <View style={styles.Consulta}>
                            <Icon
                                reverse
                                name='send'
                                type='font-awesome'
                                color='black'
                                onPress={() => fetchDataFromServer(this.props.token,
                                    `http://127.0.0.1:8000/voltages/current-user/?q=${initialDatePicked}-${endDatePicked}`)} />
                        </View>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                        />
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

const styles = StyleSheet.create({

    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 11
    },
    Historics: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50
    },
    Consulta: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    }
});

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        id: state.auth.id,
        loading: state.auth.loading
    }
}


export default connect(mapStateToProps, null)(Historics)

