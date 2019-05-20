import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableHighlight,
  NativeEventEmitter,
  NativeModules,
  ListView,
  Platform,
  PermissionsAndroid,
  Picker
} from 'react-native'
import { Text, CheckBox } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements'
import Toast, { DURATION } from 'react-native-easy-toast'
import BleManager from 'react-native-ble-manager'

import { sendDataToServer, removeItemValue, sendDataToServerTest } from './BleUtils'
import * as actions from '../Stores/Actions/auth'

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
const BleManagerModule = NativeModules.BleManager


/*
Sometimes an app needs to access a platform API and React Native doesn't have a corresponding module yet. 
Maybe you want to reuse some existing Objective-C, Swift or C++ code without having to reimplement it in JavaScript, 
or write some high performance. NativeModules will not expose any methods of BleManager to JavaScript unless explicitly
told to, as we will further.
*/

const BleManagerEmitter = new NativeEventEmitter(BleManagerModule)

/* Subscribing events from BleManagerModule by creating a new NativeEventEmitter instance around this module, this
will be helpful later the in code */
const INITIAL_STATE = {
  scanning: false,
  peripherals: new Map(),
  pickerValue: '',
  status: '',
  dataDoubleVoltage: '',
  dataDoubleVoltageCoilOne: '',
  dataDoubleVoltageCoilTwo: '',
  checked: false,
  iconColor: 'red',
  detectedActivity: ''
}

class Ble extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...INITIAL_STATE,
      userData: [{
        id: this.props.id,
        voltage: '',
        coilOneData: '',
        coilTwoData: '',
      }],
    }
    this.dataFlag = false
    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this)
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this)
  }

  componentDidMount() {
    this.handlerDiscover = BleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral)
    this.handlerDisconnect = BleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral)
    /* This code line handles the discover of new devices, the BleManagerEmitter (NativeEventEmitter), as soon as the 
    component is render (componentDidMount) it will keep doing the BleManager function "BleManagerDiscoverPeripheral",
    which will notificate or create an event everytime the scan finds a new peripheral */
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange)
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({ status: isConnected }) }
    );
    /*NetInfo informs about the network status whether if it's connected or not */
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
        if (result) {
          console.log("All permissions given")
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
              console.log("User accept")
            } else {
              console.log("User refuse")
            }
          })
        }
      })
      removeItemValue()
    }

    /* In case of not having the permission to access to location (in Android Devices) this will ask the user for permission
    to access for BLE working properly */
    BleManager.enableBluetooth()
      .then(() => {
        this.refs.toast.show('Bluetooh activado', DURATION.LENGTH_LONG)
      })
      .catch((error) => {
        this.refs.toast.show('Active el bluetooh' + error, DURATION.LENGTH_LONG)
      })
    /* If the BT is not enable, this will ask the user to enable it right after the component is render */
    BleManager.start({ showAlert: false })
      .then(() => {
        this.refs.toast.show('Módulo BT inicializado', DURATION.LENGTH_LONG);
        BleManager.scan([], 120)
      })
    /*Start scanning for BT devices for a time period of 120 seconds*/
  }

  componentWillUnmount() {
    this.handlerDiscover.remove()
    this.handlerDisconnect.remove()
    removeItemValue()
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange)
  }

  handleConnectionChange = (isConnected) => {
    this.setState({ status: isConnected })
  }

  handleDiscoverPeripheral(peripheral) {
    var peripherals = this.state.peripherals
    if (!peripherals.has(peripheral.id)) {
      peripherals.set(peripheral.id, peripheral)
      this.setState({ peripherals })
    }
  }

  /*
  This portion of code, as its name indicates, handles what happens whenever a new device is discovered by the BT
  what it does is add a new element to the map object (peripherals), with the key (peripheral.id) and the value 
  (peripheral) specified allowing to update the peripherals found
  */

  handleDisconnectedPeripheral(data) {
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({ peripherals });
    }
  }

  /*
  This portion of code, as its name indicates, handles what happens whenever a user wants to disconnect a device
  what it does is get the data from peripherals (array(key/value)) as it inherited the 'BleManagerDiscoverPeripheral'
  data is possible to get data.peripheral for retrieving the key and the value and setting the 'connected' attribute 
  to false managing to disconnect the device
  */

  scanForAPeriodOfTime = () => {
    this.dataFlag ? this.dataFlag = false : this.dataFlag = true
    this.dataFlag ? this.setState({ iconColor: 'green' }) : this.setState({ iconColor: 'red' })
    if (this.dataFlag) {
      setTimeout(() => {
        this.dataFlag = false
        this.setState({
          iconColor: 'red'
        })
      }, 180000)
    }
  }

  startScan = () => {
    console.log('Listando nuevos dispositivos')
    if (!this.state.scanning) {
      this.setState({ peripherals: new Map() });
      BleManager.scan([], 20, true).then((results) => {
        this.refs.toast.show('Escaneando dispositivos', DURATION.LENGTH_LONG);
        this.setState({ scanning: true });
      });
    }
  }


  bleActionTraining = (peripheral) => {
    if (peripheral) {
      if (peripheral.connected) {
        BleManager.disconnect(peripheral.id);
      } else {
        BleManager.connect(peripheral.id).then(() => {
          let peripherals = this.state.peripherals;
          let p = peripherals.get(peripheral.id);
          if (p) {
            p.connected = true;
            peripherals.set(peripheral.id, p);
            this.setState({ peripherals });
          }
          BleManager.retrieveServices(peripheral.id).then(() => {
            const serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
            const characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
            let arrayDataChar = []
            let userVoltageData = []
            let coilOneData = []
            let coilTwoData = []
            let counterData = 0
            /* Since we're delimiting the data collection from a single device don't ask for serviceUUID or the
            characteristicUUID we give it to the connection in order to run the BleManager.startNotification and the
            reading of the data from the device of interest */
            BleManager.startNotification(peripheral.id, serviceUUID, characteristicUUID).then(() => {
              BleManager.read(peripheral.id, serviceUUID, characteristicUUID)
                .then(() => {
                  return BleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', (data) => {
                    arrayDataChar = data.value.map(value => {
                      return String.fromCharCode(value)
                    })
                    arrayDataChar = arrayDataChar.join('')
                    let res = arrayDataChar.split("#")
                    coilOneData = res[0]
                    coilTwoData = res[1]
                    userVoltageData = res[2]

                    let btInfo = {
                      "user": `${this.props.id}`,
                      "voltage_coil_1": `${coilOneData}`,
                      "voltage_coil_2": `${coilTwoData}`,
                      "voltage_generated_by_user": `${userVoltageData}`,
                      "activity": `${this.state.pickerValue}`
                    }
                    if (this.dataFlag) {
                      AsyncStorage.getItem('databaseTrain').then((value) => {
                        let existingData = JSON.parse(value)
                        if (!existingData) {
                          existingData = []
                        }
                        existingData.push(btInfo)
                        AsyncStorage.setItem('databaseTrain', JSON.stringify(existingData))
                          .then(() => {
                            console.log(existingData)
                          })
                          .catch(() => {
                            console.log('There was an error saving the data')
                          })
                        if (counterData > 20) {
                          sendDataToServer('', value)
                          removeItemValue()
                          counterData = 0
                        }
                        counterData = counterData + 1
                      })
                        .catch((error) => {
                          console.log(error)
                        })
                    } else {
                      console.log('Habilte la bandera para enviar los datos')
                    }
                  })
                })
                .catch((error) => {
                  console.log(error);
                });
            }).catch((error) => {
              console.log(error);
            });
          });
        }).catch((error) => {
          console.log(error);
        });
      }
    }
  }

  render() {
    const list = Array.from(this.state.peripherals.values());
    const dataSource = ds.cloneWithRows(list);
    return (
      <View style={styles.MainContainer}>
        <Text style={{ paddingTop: 50, alignSelf: 'center' }} h4>¡Conéctate con tu dispositivo!</Text>
        <View style={styles.boxOne}>
          <Icon
            reverse
            name='bluetooth'
            type='font-awesome'
            color='rgba(41, 128, 185,1.0)'
            onPress={this.startScan.bind(this)}
          />
          <Icon
            reverse
            name='check'
            type='font-awesome'
            color={this.state.iconColor}
            onPress={this.scanForAPeriodOfTime.bind(this)}
          />
        </View>
        <View style={styles.boxTwo}>
          {this.state.checked ? (
            <Picker
              selectedValue={this.state.pickerValue}
              onValueChange={(itemValue, itemIndex) => this.setState({ pickerValue: itemValue })}
            >
              <Picker.Item label='Seleccione una actividad' value='' />
              <Picker.Item label='Caminar' value='7' />
              <Picker.Item label='Saltar' value='8' />
              <Picker.Item label='Correr' value='9' />
              <Picker.Item label='Permancer quieto' value='10' />
              <Picker.Item label='Torso' value='11' />
            </Picker>
          ) : null}
          <CheckBox
            title='Habilitar | Deshabilitar modo de entrenamiento'
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checked={this.state.checked}
            onPress={() => this.setState({ checked: !this.state.checked })}
          />
        </View>
        <ListView
          enableEmptySections={true}
          dataSource={dataSource}
          renderRow={(item) => {
            const color = item.connected ? 'rgba(52, 152, 219,0.8)' : 'rgba(52, 152, 219,0.5)';
            return (
              <TouchableHighlight onPress={() => this.bleActionTraining(item)}>
                <View style={[styles.row, { backgroundColor: color }]}>
                  <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 10, borderRadius: 10 }}>{item.name}</Text>
                  <Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 10, borderRadius: 10 }}>{item.id}</Text>
                </View>
              </TouchableHighlight>
            );
          }}
        />

        <Toast
          ref="toast"
          style={{ backgroundColor: 'transparent' }}
          position='bottom'
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
const styles = StyleSheet.create({

  MainContainer: {

    flex: 1,
  },
  boxOne: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 11,
    paddingTop: 30
  },
  boxTwo: {
    width: '100%',
  },
  row: {
    margin: 10,
    borderRadius: 12
  }
});

const mapDispatchToProps = dispatch => {
  return {
    activityRecognition: (coilOneData, coilTwoData, userVoltageData) => dispatch(actions.activityClassifier(coilOneData, coilTwoData, userVoltageData))
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    id: state.auth.id,
    activity: state.auth.activity
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Ble)


