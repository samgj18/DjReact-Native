import React, { Component } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text } from 'react-native-elements'
import { connect } from 'react-redux';
import Toast, { DURATION } from 'react-native-easy-toast'
import PreLoader from '../Components/PreLoader'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { Icon } from 'react-native-elements'
import { AreaChart, XAxis, YAxis, BarChart } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import { fetchDataFromServer } from '../BleModule/BleUtils'

class Historics extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isDateTimePickerVisible: false,
            isTimePickerVisible: false,
            initialTimePicked: '',
            endTimePicked: '',
            initialDatePicked: '',
            endDatePicked: '',
            completeDate: '',
            header: 'Selecciona la fecha inicial',
            voltageCoilOne: [],
            voltageCoilTwo: [],
            activities: [0]
        }
        this.counter = 0
    }
    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    showTimePicker = () => {
        this.setState({ isTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    hideTimePicker = () => {
        this.setState({ isTimePickerVisible: false });
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
                header: '¡Selecciona la hora con el botón de al lado!'
            }, () => {
                console.log(this.state.endDatePicked)
                console.log(this.counter)
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


    handleTimeRange = (time) => {
        if (this.counter === 0) {
            this.setState({
                initialTimePicked: time,
                header: 'Selecciona la hora final'
            }, () => {
                console.log(this.state.initialTimePicked)
                this.counter = this.counter + 1
                this.showTimePicker()
                this.refs.toast.show('Selecciona hora final', DURATION.LENGTH_SHORT)
            })
        } else {
            this.setState({
                endTimePicked: time,
                header: '¡Realiza la consulta con el botón de abajo!'
            }, () => {
                console.log(this.state.endTimePicked)
                this.hideTimePicker()
                this.counter = 0
                this.setState({
                    completeDate: `${this.state.initialDatePicked},${this.state.initialTimePicked}-${this.state.endDatePicked},${this.state.endTimePicked}`
                }, () => {
                    console.log(this.state.completeDate)
                })
            })
        }
    }

    handleTimePicked = (datetime) => {
        let curr_hour = datetime.getHours();
        let curr_min = datetime.getMinutes();
        let curr_sec = datetime.getSeconds();
        let mydatestr = curr_hour + ',' +
            curr_min + ',' +
            curr_sec
        this.setState({
            header: 'Seleccione la hora inicial'
        }, () => {
            this.hideTimePicker()
            this.handleTimeRange(mydatestr)
        })
    }

    handleDataFetch = async (completeDate) => {
        if (completeDate != '') {
            const response = await fetchDataFromServer(this.props.token,
                `http://72.14.177.247/voltages/current-user/?q=${completeDate}`)
            this.setState({
                voltageCoilOne: response[0]
            }, () => {
                this.setState({
                    voltageCoilTwo: response[1]
                }, () => {
                    this.setState({
                        activities: response[2]
                    }, () => {
                        if (this.state.voltageCoilOne == [] || this.state.voltageCoilTwo == []) {
                            this.refs.toast.show('No pudimos obtener los datos', DURATION.LENGTH_SHORT)
                        } else {
                            this.refs.toast.show('Datos obtenidos exitosamente', DURATION.LENGTH_SHORT)
                        }
                    })
                })
            })
        } else {
            this.refs.toast.show('Seleccione una fecha', DURATION.LENGTH_SHORT)
        }
    }




    render() {
        const { voltageCoilOne, voltageCoilTwo, activities, completeDate } = this.state
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
                        <View style={{ flexDirection: 'row' }}>
                            <Icon
                                reverse
                                name='calendar'
                                type='font-awesome'
                                color='#1C1612'
                                onPress={this.showDateTimePicker}
                            />
                            <Icon
                                reverse
                                name='clock-o'
                                type='font-awesome'
                                color='#1C1612'
                                onPress={this.showTimePicker}
                            />
                        </View>
                    </View>
                    <ScrollView style={{ flex: 2 }}>
                        <View style={styles.Charts}>
                            <Text style={{ color: 'grey', alignSelf: 'center', paddingLeft: 5 }}>Bobina 1</Text>
                            <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
                                <YAxis
                                    data={voltageCoilOne}
                                    contentInset={{ top: 30, bottom: 30 }}
                                    svg={{
                                        fill: 'grey',
                                        fontSize: 8,
                                    }}
                                    numberOfTicks={voltageCoilOne.length}
                                    formatLabel={value => `${value}V`}
                                />
                                <AreaChart
                                    style={{ height: 150, flex: 1 }}
                                    data={voltageCoilOne}
                                    contentInset={{ top: 30, bottom: 30 }}
                                    curve={shape.curveNatural}
                                    svg={{ fill: '#CFFCFF' }}
                                >
                                </AreaChart>
                            </View>
                            <XAxis
                                style={{ marginHorizontal: -10 }}
                                data={voltageCoilOne}
                                formatLabel={(value, index) => index}
                                contentInset={{ left: 30, right: 30 }}
                                svg={{ fontSize: 10, fill: 'grey' }}
                            />
                        </View>
                        <View style={styles.Charts}>
                            <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
                                <YAxis
                                    data={voltageCoilTwo}
                                    contentInset={{ top: 30, bottom: 30 }}
                                    svg={{
                                        fill: 'grey',
                                        fontSize: 8,
                                    }}
                                    numberOfTicks={voltageCoilTwo.length}
                                    formatLabel={value => `${value}V`}
                                />
                                <AreaChart
                                    style={{ height: 150, flex: 1 }}
                                    data={voltageCoilTwo}
                                    contentInset={{ top: 30, bottom: 30 }}
                                    curve={shape.curveNatural}
                                    svg={{ fill: '#1C1612' }}
                                >
                                </AreaChart>
                            </View>
                            <XAxis
                                style={{ marginHorizontal: -10 }}
                                data={voltageCoilTwo}
                                formatLabel={(value, index) => index}
                                contentInset={{ left: 30, right: 30 }}
                                svg={{ fontSize: 10, fill: 'grey' }}
                            />
                        </View>
                        <Text style={{ color: 'grey', alignSelf: 'center', paddingLeft: 5 }}>Bobina 2</Text>
                        <View style={[styles.Charts, { paddingTop: 30 }]}>
                            <Text style={{ color: 'grey', alignSelf: 'center', paddingLeft: 5 }}>Actividades</Text>
                            <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
                                <YAxis
                                    data={activities}
                                    contentInset={{ top: 30, bottom: 30 }}
                                    svg={{
                                        fill: 'grey',
                                        fontSize: 8,
                                    }}
                                    numberOfTicks={activities.length}
                                    formatLabel={value => `${value}`}
                                />
                                <BarChart
                                    style={{ height: 150, flex: 1 }}
                                    data={activities}
                                    contentInset={{ top: 30, bottom: 30 }}
                                    svg={{ fill: '#C19AB7' }}
                                >
                                </BarChart>
                            </View>
                            <XAxis
                                style={{ marginHorizontal: -10 }}
                                data={activities}
                                formatLabel={(value, index) => index}
                                contentInset={{ left: 30, right: 30 }}
                                svg={{ fontSize: 10, fill: 'grey' }}
                            />
                        </View>
                    </ScrollView>
                    <View style={styles.Consulta}>
                        <Text style={{ color: 'grey', alignSelf: 'center', paddingLeft: 5 }}>
                            Actividad 1 = Mover el torso,
                    </Text>
                        <Text style={{ color: 'grey', alignSelf: 'center', paddingLeft: 5 }}>
                            Actividad 2 = Saltar,
                    </Text>
                        <Text style={{ color: 'grey', alignSelf: 'center', paddingLeft: 5 }}>
                            Actividad 3 = Correr,
                    </Text>
                        <Text style={{ color: 'grey', alignSelf: 'center', paddingLeft: 5 }}>
                            Actividad 4 = Permanecer quieto,
                    </Text>
                        <Text style={{ color: 'grey', alignSelf: 'center', paddingLeft: 5 }}>
                            Actividad 5 = Caminar
                    </Text>

                        <Icon
                            reverse
                            name='send'
                            type='font-awesome'
                            color='#1C1612'
                            onPress={() => this.handleDataFetch(completeDate)} />
                    </View>

                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                    />
                    <DateTimePicker
                        mode='time'
                        isVisible={this.state.isTimePickerVisible}
                        onConfirm={this.handleTimePicked}
                        onCancel={this.hideTimePicker}
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

