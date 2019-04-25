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

class Ble extends Component {
  constructor(props) {
    super(props)

    const { navigation } = this.props;
    const userID = navigation.getParam('userID')
    this.state = {
      scanning: false,
      peripherals: new Map(),
      userData: [{
        id: userID,
        voltage: '',
        coilOneData: '',
        coilTwoData: '',
      }],
      pickerValue: '',
      status: '',
      dataDoubleVoltage: '',
      dataDoubleVoltageCoilOne: '',
      dataDoubleVoltageCoilTwo: '',
      userID: userID,
      iconColor: 'red'
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

  sendDataToServer = async (value, coilOne, coilTwo, id,datetime,activity) => {
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

  /*
    Sending data to the server
  */
 
  //alert('A list was submitted: ' + this.state.formvalue);


  async removeItemValue() {
    try {
      await AsyncStorage.removeItem('databaseTest');
      return true;
    }
    catch (exception) {
      return false;
    }
  }
  /*
    Allows us to remove or clear out the local database with 'removeItem' method
  */

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
                    console.log(this.props.token)
                    this.setState({
                      dataDoubleVoltage: userVoltageData,
                      dataDoubleVoltageCoilOne: coilOneData,
                      dataDoubleVoltageCoilTwo: coilTwoData,
                    })

                    /* We are getting the data that the Microcontroller is sending and converting to a string chain from the
                    Unicode numbers then by means of .join ('') we are deleting the commas and turning the list into one single
                    element and sending that data to the state as a single value */
                    try {
                      let userData = this.state.userData
                      userData[0].voltage = this.state.dataDoubleVoltage
                      userData[0].coilOneData = this.state.dataDoubleVoltageCoilOne
                      userData[0].coilTwoData = this.state.dataDoubleVoltageCoilTwo
                      userData[0].id = this.state.userID
                      this.setState({
                        userData
                      })
                      /* Here we're getting the object of the state userData and assigning it to a local variable called userData 
                      the we take the dataDoubleVoltage state value prevoiusly assigned (line 222) and the id (which is passed
                      through the react navigation props (line 38) (UserScreen line 53) (HomeScreen father component line 77).*/
                      AsyncStorage.getItem('databaseTest').then((value) => {
                        if (this.state.status && this.dataFlag) {
                          if (value !== null) {
                            const existingData = JSON.parse(value)
                            existingData.push(this.state.userData)
                            const headers = Object.keys(existingData[0])
                            for (const row of existingData) {
                              const values = headers.map(header => {
                                return row[header]
                              })
                              this.datRows.push(values)
                              this.sendDataToServer(row.voltage, row.coilOneData, row.coilTwoData, row.id,null,this.state.pickerValue)
                            }
                            this.removeItemValue()
                            NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
                            NetInfo.isConnected.fetch().done(
                              (isConnected) => { this.setState({ status: isConnected }); }
                            )
                            console.log('Base de datos local no vacía enviando todos los datos')
                          } else {
                            this.sendDataToServer(this.state.dataDoubleVoltage, this.state.dataDoubleVoltageCoilOne, this.state.dataDoubleVoltageCoilTwo, this.state.userID,null,this.state.pickerValue)
                            this.removeItemValue()
                            console.log('Base de datos local vacía enviando dato')
                            NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange)
                            NetInfo.isConnected.fetch().done(
                              (isConnected) => { this.setState({ status: isConnected }) }
                            )
                          }
                        } else if (!this.state.status && this.dataFlag) {
                          if (value !== null) {
                            const existingData = JSON.parse(value)
                            existingData.push(this.state.userData[0])
                            AsyncStorage.setItem('databaseTest', JSON.stringify(existingData)).then(() => {
                              console.log('No hay conexión base de datos local no vacía ' + this.state.status)
                            })
                            NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
                            NetInfo.isConnected.fetch().done(
                              (isConnected) => { this.setState({ status: isConnected }) }
                            );
                          } else {
                            AsyncStorage.setItem('databaseTest', JSON.stringify(this.state.userData)).then(() => {
                              console.log('No hay conexión base de datos local vacía ' + this.state.status)
                            })
                            NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
                            NetInfo.isConnected.fetch().done(
                              (isConnected) => {
                                this.setState({ status: isConnected });
                              }
                            );
                          }
                        }else{
                          console.log('Error, no se pudieron tomar los datos')
                        }
                      })
                    } catch (error) {
                      this.refs.toast.show(error, DURATION.LENGTH_LONG);
                    }
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
    token: state.token
  }
}

export default connect(mapStateToProps, null)(Ble)


