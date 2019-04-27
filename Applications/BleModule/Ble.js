import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeEventEmitter,
  NativeModules,
  ListView,
  Platform,
  PermissionsAndroid,
  Picker
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements'
import Toast, { DURATION } from 'react-native-easy-toast'
import BleManager from 'react-native-ble-manager'
import * as actions from '../Stores/Actions/ble'


const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
const BleManagerModule = NativeModules.BleManager
const date = new Date().toISOString().slice(0, 19).replace('T', ' ');


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
  dataDoubleVoltage: '',
  dataDoubleVoltageCoilOne: '',
  dataDoubleVoltageCoilTwo: '',
  iconColor: 'red',
  pickerValue: '',
  scanning: false,
  peripherals: new Map(),
  status: '',

}


class Ble extends Component {
  constructor(props) {
    super(props)

    const { navigation } = this.props;
    const userID = navigation.getParam('userID')
    this.state = {
      ...INITIAL_STATE,
      userData: [{
        id: userID,
        voltage: '',
        coilOneData: '',
        coilTwoData: '',
      }],
      userID: userID
    }
    this.dataFlag = false
    this.datRows = []
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
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange)
  }

  handleConnectionChange = (isConnected) => {
    this.setState({ status: isConnected })
  }

  handleDiscoverPeripheral(peripheral) {
    this.props.discoveredPeripheral(peripheral, this.state.peripherals)
  }


  scanForPeriodOfTime = () => {
    this.dataFlag = this.dataFlag ? this.dataFlag = false : this.dataFlag = true
    this.setState({
      iconColor: this.dataFlag ? iconColor = 'green' : iconColor = 'red'
    })
    console.log(this.dataFlag + this.state.iconColor)
    if (this.dataFlag) {
      setTimeout(() => {
        this.dataFlag = false
        this.setState({
          iconColor: 'red'
        })
        console.log(this.dataFlag + this.state.iconColor)
      }, 60 * 3000);
    }
  }

  handleDisconnectedPeripheral(data) {
    this.props.disconnectedPeripheral(data,this.state.peripherals)
  }

  sendDataToServer = async (value, coilOne, coilTwo, id, datetime, activity) => {
    try {
      let config = {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.props.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //user: id,
          voltage_coil_1: coilOne,
          voltage_coil_2: coilTwo,
          voltage_generated_by_user: value,
          activity,
          //datetime
        })
      }
      const URL = 'http://72.14.177.247/voltages/test-data/'
      const response = await fetch(URL, config)
      const serverResponse = await response.json()
      console.log(serverResponse)
    } catch (error) {
      console.log(error)
    }
  }



  async removeItemValue() {
    try {
      await AsyncStorage.removeItem('databaseTest');
      return true;
    }
    catch (exception) {
      return false;
    }
  }

  testConnection = (peripheral) => {

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

            BleManager.startNotification(peripheral.id, serviceUUID, characteristicUUID).then(() => {
              BleManager.read(peripheral.id, serviceUUID, characteristicUUID)
                .then(() => {
                  return BleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', (data) => {
                    arrayDataChar = data.value.map(value => {
                      return String.fromCharCode(value)
                    })
                    console.log('Persistencia')
                  })
                })
                .catch((error) => {
                  console.log('Connection error', error);
                  this.refs.toast.show(error, DURATION.LENGTH_LONG);
                });
            }).catch((error) => {
              console.log('Connection error', error);
              this.refs.toast.show(error, DURATION.LENGTH_LONG);
            });
          });
        }).catch((error) => {
          console.log('Connection error', error);
          this.refs.toast.show(error, DURATION.LENGTH_LONG);
        });
      }
    }
  }

  startScan = () => {
    if (!this.state.scanning) {
      this.setState({ peripherals: new Map() });
      BleManager.scan([], 20, true).then((results) => {
        this.refs.toast.show('Escaneando dispositivos', DURATION.LENGTH_LONG);
        this.setState({ scanning: true });
      });
    }
  }
  /*
    It handles the scanning process, what it does is calling the 'BleManager.scan' method of the BleManager Module
    with three parameters:
    1.serviceUUIDs - Array of String - the UUIDs of the services to looking for. 
    2.seconds - Integer - the amount of seconds to scan.
    3.allowDuplicates - Boolean - [iOS only] allow duplicates in device scanning (Not required)
  */




  render() {
    const list = Array.from(this.state.peripherals.values());
    const dataSource = ds.cloneWithRows(list);
    return (
      <View style={styles.MainContainer}>
        <View style={styles.boxOne}>
          <Icon
            reverse
            name='bluetooth'
            type='font-awesome'
            color='rgba(41, 128, 185,1.0)'
            action={this.startScan.bind(this)}
          />
          <Icon
            reverse
            name='check'
            type='font-awesome'
            color={this.state.iconColor}
            onPress={this.scanForPeriodOfTime.bind(this)} />
        </View>
        <View style={styles.boxTwo}>
          <Picker
            selectedValue={this.state.pickerValue}
            onValueChange={(itemValue, itemIndex) => this.setState({ pickerValue: itemValue })}
          >
            <Picker.Item label='Seleccione una actividad' value='' />
            <Picker.Item label='Caminar' value='1' />
            <Picker.Item label='Saltar' value='2' />
            <Picker.Item label='Correr' value='3' />
            <Picker.Item label='Subir o Bajar escaleras' value='4' />
          </Picker>
        </View>
        <ListView
          enableEmptySections={true}
          dataSource={dataSource}
          renderRow={(item) => {
            const color = item.connected ? 'rgba(52, 152, 219,0.8)' : 'rgba(52, 152, 219,0.5)';
            return (
              <TouchableHighlight onPress={() => this.testConnection(item)}>
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
  },
  boxTwo: {
    width: '100%',
  },
  row: {
    margin: 10
  }
});

const mapStateToProps = state => {
  return {
    token: state.auth.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    discoveredPeripheral: (peripheral, peripherals) => dispatch(actions.handleDiscoverPeripheral(peripheral, peripherals)),
    disconnectedPeripheral:(data,peripherals)=> dispatch(actions.handleDisconnectedPeripheral(data,peripherals))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Ble)


