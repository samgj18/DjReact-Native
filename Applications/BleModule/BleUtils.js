import AsyncStorage from '@react-native-community/async-storage'

export const sendDataToServer = async (token, data) => {
  try {
    let config = {
      method: 'POST',
      headers: {
        'Authorization': 'Token' + ' ' + token,
        'Content-Type': 'application/json',
      },
      body: data
    }
    const URL = 'http://72.14.177.247/voltages/all-data/'
    const response = await fetch(URL, config)
    const serverResponse = await response.json()
    removeItemValueUser()
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
        'Authorization': 'Token' + ' ' + token,
        'Content-Type': 'application/json',
      },
      body: data
    }
    const URL = 'http://72.14.177.247/voltages/test-data/'
    const response = await fetch(URL, config)
    const serverResponse = await response.json()
    removeItemValue()
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
        'Authorization': 'Token' + ' ' + token,
        'Content-Type': 'application/json',
      },
    }
    const URL = url
    const response = await fetch(URL, config)
    const serverResponse = await response.json()
    const data = serverResponse.map(row => ({
      voltageCoilOne: row.voltage_coil_1,
      voltageCoilTwo: row.voltage_coil_2,
      activity: row.activity,
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
  activity = []
  const headers = Object.keys(data[0])
  for (const row of data) {
    const values = headers.map(header => {
      return row[header]
    })
    voltageCoilOne.push(parseInt(values[0]))
    voltageCoilTwo.push(parseInt(values[1]))
    activity.push(parseInt(values[2]))
  }
  return [voltageCoilOne, voltageCoilTwo, activity]
}




export const removeItemValue = async () => {
  try {
    await AsyncStorage.removeItem('databaseTest');
  }
  catch (exception) {
    console.log('Unable to erase data')
  }
}

export const removeItemValueUser = async () => {
  try {
    await AsyncStorage.removeItem('databaseTrain');
  }
  catch (exception) {
    console.log('Unable to erase data')
  }
}