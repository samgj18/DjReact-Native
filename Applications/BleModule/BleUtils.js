import AsyncStorage from '@react-native-community/async-storage'

export const sendDataToServer = async (token, data) => {
  try {
    let config = {
      method: 'POST',
      headers: {
        'Authorization': 'Token' + ' ' + 'e7afb8fe0eae218e947de82b7a274c393ac0bf93',
        'Content-Type': 'application/json',
      },
      body: data
    }
    const URL = 'http://72.14.177.247/voltages/train-data/'
    const response = await fetch(URL, config)
    const serverResponse = await response.json()
    console.log(serverResponse)
  } catch (error) {
    console.log(error)
  }
}

export const sendDataToServerTest = async (token, data) => {
  try {
    let config = {
      method: 'POST',
      headers: {
        'Authorization': 'Token' + ' ' + 'e7afb8fe0eae218e947de82b7a274c393ac0bf93',
        'Content-Type': 'application/json',
      },
      body: data
    }
    const URL = 'http://72.14.177.247/voltages/test-data/'
    const response = await fetch(URL, config)
    const serverResponse = await response.json()
    console.log(serverResponse)
  } catch (error) {
    console.log(error)
  }
}


export const fetchDataFromServer = async (token, url) => {
  try {
    let config = {
      method: 'GET',
      headers: {
        'Authorization': 'Token' + ' ' + 'e7afb8fe0eae218e947de82b7a274c393ac0bf93',
        'Content-Type': 'application/json',
      },
    }
    const URL = url
    const response = await fetch(URL, config)
    const serverResponse = await response.json()
    const data = serverResponse.map(row => ({
      voltageCoilOne: row.voltage_coil_1,
      voltageCoilTwo: row.voltage_coil_2
    }))
    const rowVoltageData = rowConverterVoltageCoils(data)
    return (rowVoltageData)
  } catch (error) {
    console.log(error)
  }
}

export const fetchDataFromServerBatery = async (token, url) => {
  try {
    let config = {
      method: 'GET',
      headers: {
        'Authorization': 'Token' + ' ' + token,
        'Content-Type': 'application/json',
      },
    }
    const URL = url
    const response = await fetch(URL, config)
    const serverResponse = await response.json()
    const data = serverResponse.map(row => ({
      voltageGeneratedByUser: row.voltage_generated_by_user,
    }))
    const rowVoltageData = rowConverterVoltageUser(data)
    return (rowVoltageData)
  } catch (error) {
    console.log(error)
  }
}

export const calculateLifeExpansionBatery = (voltages) => {
  let bateryLifeExtensionCounter = 0
  voltages.map(voltage => {
    const doubleVoltage = parseFloat(voltage)
    if (doubleVoltage >= 3.290) {
      bateryLifeExtensionCounter = bateryLifeExtensionCounter + 1
    }
  })
  const bateryLifeExtension = 0.05 * bateryLifeExtensionCounter
  return bateryLifeExtension
}

rowConverterVoltageUser = (data) => {
  voltageGeneratedByUser = []
  const headers = Object.keys(data[0])
  for (const row of data) {
    headers.map(header => {
      voltageGeneratedByUser.push(parseInt(row[header]))
      return row[header]
    })
  }
  return (voltageGeneratedByUser)
}

rowConverterVoltageCoils = (data) => {
  voltageCoilOne = []
  voltageCoilTwo = []
  const headers = Object.keys(data[0])
  for (const row of data) {
    const values = headers.map(header => {
      return row[header]
    })
    voltageCoilOne.push(parseInt(values[0]))
    voltageCoilTwo.push(parseInt(values[1]))
  }
  return [voltageCoilOne, voltageCoilTwo]
}




export const removeItemValue = async () => {
  try {
    //await AsyncStorage.removeItem('databaseTest');
    await AsyncStorage.removeItem('databaseTrain');
  }
  catch (exception) {
    console.log('Unable to erase data')
  }
}