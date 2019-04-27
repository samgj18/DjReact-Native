import * as actionTypes from './actionTypes'
import BleManager from 'react-native-ble-manager'

export const bleStart = () => {
    return {
        type: actionTypes.BLE_START
    }
}

export const bleScanning = (scanning) => {
    return {
        type: actionTypes.BLE_SCANNING,
        scanning: scanning
    }
}

export const bleStatus = (isConnected) => {
    return {
        type: actionTypes.BLE_STATUS,
        isConnected: isConnected
    }
}

export const blePeripherals = (peripheral, peripherals) => {
    return {
        type: actionTypes.BLE_PERIPHERALS,
        peripheral: peripheral,
        peripherals: peripherals
    }
}

export const handleConnectionChange = (isConnected) => {
    return dispatch => {
        if (isConnected) {
            dispatch(bleStatus(isConnected))
        } else {
            dispatch(bleStatus(isConnected))
        }
    }
}

export const handleDiscoverPeripheral = (peripheral, peripherals) => {
    return dispatch => {
        if (!peripherals.has(peripheral.id)) {
            peripherals.set(peripheral.id, peripheral)
            dispatch(blePeripherals(peripheral, peripherals))
        }
    }
}


export const handleDisconnectedPeripheral = (data, peripherals) => {
    return dispatch => {
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            dispatch(blePeripherals(peripherals))
        }
    }
}


export const startScan = (peripherals) => {
    return dispatch => {
        peripherals = new Map()
        let scanning = true
        dispatch(blePeripherals(null, peripherals))
        BleManager.scan([], 30, true).then((results) => {
            dispatch(bleStart())
            dispatch(bleScanning(scanning))
            dispatch(blePeripherals(null, results))
        });
    }

}
