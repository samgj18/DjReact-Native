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
    console.log(serverResponse)
  } catch (error) {
    console.log(error)
  }
}



export const removeItemValue = async () => {
  try {
    await AsyncStorage.removeItem('databaseTest');
  }
  catch (exception) {
    console.log('Unable to erase data')
  }
}