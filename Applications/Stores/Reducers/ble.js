import * as actionTypes from '../Actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    isConnected: false,
    peripherals: new Map(),
    peripheral: null,
    scanning: false,
    initialized: false
}

const bleStart = (state, action) => {
    return updateObject(state, {
        initialized: true,
    });
}

const bleScanning = (state, action) => {
    return updateObject(state, {
        scanning: true,
    });
}

const bleStatus = (state, action) => {
    return updateObject(state, {
        isConnected: action.isConnected,
    });
}

const blePeripherals = (state, action) => {
    return updateObject(state, {
        peripherals: action.peripherals,
        peripheral: action.peripheral
    });
}


const reducerBle = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.BLE_START: return bleStart(state, action);
        case actionTypes.BLE_STATUS: return bleStatus(state, action);
        case actionTypes.BLE_PERIPHERALS: return blePeripherals(state, action);
        case actionTypes.BLE_SCANNING: return bleScanning(state, action);
        default:
            return state;
    }
}

export default reducerBle;