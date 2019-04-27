export const handleConnectionChange = (isConnected) => {
    this.setState({ status: isConnected })
}

handleDiscoverPeripheral = (peripheral) => {
    var peripherals = this.state.peripherals
    if (!peripherals.has(peripheral.id)) {
        peripherals.set(peripheral.id, peripheral)
        this.setState({ peripherals })
    }
}

export const scanForPeriodOfTime = () => {
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

export const handleDisconnectedPeripheral = (data) => {
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        this.setState({ peripherals });
    }
}

export const sendDataToServer = async (value, coilOne, coilTwo, id, datetime, activity) => {
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


export const removeItemValue = async () => {
    try {
        await AsyncStorage.removeItem('databaseTest');
        return true;
    }
    catch (exception) {
        return false;
    }
}

export const startScan = () => {
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