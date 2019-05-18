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

export const calculateLifeExpansionBatery = (voltagesCoilOneFloat, voltagesCoilTwoFloat) => {
  let vAnterior = 0
  let deltaTiempo = 0.05
  let caidaDiodo = 1800
  let inductanciaBobUno = 2.16743
  let inductanciaBobDos = 2.16808
  let potBobinaUno = 0
  let potBobinaDos = 0
  let potInstaUno = 0
  let potInstaDos = 0
  let countUno = 0
  let countDos = 0
  for (let i = 0; i < voltagesCoilOneFloat.length; i++) {
    if (i == 0) {
      vAnterior = 0
    } else {
      vAnterior = voltagesCoilOneFloat[i - 1]
    }
    if (voltagesCoilOneFloat[i] > caidaDiodo) {
      potInsta = ((voltagesCoilOneFloat[i] - caidaDiodo) * (voltagesCoilOneFloat[i] - vAnterior) * (deltaTiempo)) / inductanciaBobUno
      potBobinaUno = potBobinaUno + potInstaUno
      countUno += 1
    }
  }
  vAnterior = 0
  for (let i = 0; i < voltagesCoilTwoFloat.length; i++) {
    console.log(i)
    if (i == 0) {
      vAnterior = 0
    } else {
      vAnterior = voltagesCoilTwoFloat[i - 1]
    }
    if (voltagesCoilTwoFloat[i] > caidaDiodo) {
      potInstaDos = ((voltagesCoilTwoFloat[i] - caidaDiodo) * (voltagesCoilTwoFloat[i] - vAnterior) * (deltaTiempo)) / inductanciaBobDos
      potBobinaDos = potBobinaDos + potInstaDos
      countDos += 1
    }
  }
  const energiaBobUno = (potBobinaUno * countUno)
  const energiaBobDos = (potBobinaDos * countDos)
  const bateryEnergy = energiaBobDos + energiaBobUno
  const bateryLifeExtension = bateryEnergy / 0.1282
  return [bateryLifeExtension, bateryEnergy]
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
  console.log(voltageCoilOne)
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