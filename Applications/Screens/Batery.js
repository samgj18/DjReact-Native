import React, { Component } from 'react'
import { View, StyleSheet, Button } from 'react-native'
import { Text } from 'react-native-elements'
import { connect } from 'react-redux';
import Toast, { DURATION } from 'react-native-easy-toast'
import PreLoader from '../Components/PreLoader'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { Icon } from 'react-native-elements'
import { StackedAreaChart, YAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import { fetchDataFromServer } from '../BleModule/BleUtils'

class Batery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDateTimePickerVisible: false,
            initialDatePicked: '',
            endDatePicked: '',
            header: 'Selecciona la fecha inicial',
            data: [{}]
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

    handleDataFetch = async (initialDatePicked, endDatePicked) => {
        const response = await fetchDataFromServer('5754db9208cf223a2a40220b1a6fb65d419fd437',
            `http://127.0.0.1:8000/voltages/current-user/?q=${initialDatePicked}-${endDatePicked}`)
        this.setState({
            data: response
        }, () => {
            if (data != null) {
                this.refs.toast.show('Datos obtenidos exitosamente', DURATION.LENGTH_SHORT)
            } else {
                this.refs.toast.show('No pudimos obtener los datos', DURATION.LENGTH_SHORT)
            }

        })
    }




    render() {



        const colors = ['rgba(38, 222, 129,1.0)', 'rgba(38, 222, 129,0.6)',]
        const keys = ['voltageCoilOne', 'voltageCoilTwo',]
        const svgs = [
            { onPress: () => this.refs.toast.show('Voltaje bobina 1', DURATION.LENGTH_SHORT) },
            { onPress: () => this.refs.toast.show('Voltaje bobina 2', DURATION.LENGTH_SHORT) },
        ]

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
                    </View>
                    <View style={styles.Charts}>
                        <YAxis
                            data={[1, 2]}
                            contentInset={{ top: 20, bottom: 20 }}
                            svg={{
                                fill: 'grey',
                                fontSize: 10,
                            }}
                            numberOfTicks={1}
                            formatLabel={value => `${value} Bobina `}
                        />
                        <StackedAreaChart
                            style={{ height: 230, paddingVertical: 16, flex: 1 }}
                            data={this.state.data}
                            keys={keys}
                            colors={colors}
                            curve={shape.curveNatural}
                            showGrid={true}
                            svgs={svgs}
                        />
                    </View>
                    <View style={styles.Consulta}>
                        <Icon
                            reverse
                            name='send'
                            type='font-awesome'
                            color='black'
                            onPress={() => this.handleDataFetch(initialDatePicked, endDatePicked)} />
                    </View>

                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                    />


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
    },
    Charts: {
        flex: 1,
        flexDirection: 'row'
    }
});

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        id: state.auth.id,
        loading: state.auth.loading
    }
}


export default connect(mapStateToProps, null)(Batery)