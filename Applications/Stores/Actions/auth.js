
import * as actionTypes from './actionTypes';
import AsyncStorage from "@react-native-community/async-storage";
import { RandomForestClassifier } from '../../MachineLearning/HARKE-RF'
import * as math from 'mathjs'

const prediction = new RandomForestClassifier()
let auxCounter = 0
let voltagesX = []
let voltagesY = []
let activity = null

export const activityMade = (activity) => {
    return {
        type: actionTypes.ACTIVITY_RECOGNITION,
        activity: activity,
    }
}

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, id) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        id: id,
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('id');
    AsyncStorage.removeItem('expirationDate');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
}

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    }
}

export const authLogin = (username, password) => {
    return async dispatch => {
        dispatch(authStart());
        try {
            let config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
            const URL = 'http://72.14.177.247/rest-auth/login/'
            const response = await fetch(URL, config)
            console.log(response)
            const userInfo = await response.json()
            const token = userInfo.key
            const idInt = userInfo.user.id
            const id = idInt.toString()
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            if (token == null) {
                dispatch(authFail('Credenciales incorrectas'))
            } else {
                AsyncStorage.setItem('token', token);
                AsyncStorage.setItem('id', id);
                AsyncStorage.setItem('expirationDate', expirationDate);
                dispatch(authSuccess(token, id));
                dispatch(checkAuthTimeout(3600));
            }
        } catch (error) {
            dispatch(authFail(error))
        }
    }
}

export const authSignUp = (username, email, password1, password2) => {
    return async dispatch => {
        dispatch(authStart());
        try {
            let config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password1: password1,
                    password2: password2
                })
            }
            const URL = 'http://72.14.177.247/rest-auth/registration/'
            const response = await fetch(URL, config)
            const tokenJSON = await response.json()
            const token = tokenJSON.key
            const id = await getIdAuth(username, password1)
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            if (token == null) {
                dispatch(authFail('Datos incorrectos o mal ingresados'))
            } else {
                AsyncStorage.setItem('token', token);
                AsyncStorage.setItem('id', id);
                AsyncStorage.setItem('expirationDate', expirationDate);
                dispatch(authSuccess(token, id));
                dispatch(checkAuthTimeout(3600));
            }
        } catch (error) {
            dispatch(authFail(error))
        }
    }
}


export const authCheckState = () => {
    return dispatch => {
        const token = AsyncStorage.getItem('token');
        if (token === null) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(AsyncStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
            }
        }
    }
}


export const featuresList = (voltagesX, voltagesY) => {
    let meanX = math.mean(voltagesX)
    let meanY = math.mean(voltagesY)
    let stdX = math.std(voltagesX)
    let stdY = math.std(voltagesY)
    let varX = math.var(voltagesX)
    let varY = math.var(voltagesY)
    let madX = math.mad(voltagesX)
    let madY = math.mad(voltagesY)
    let dom = meanX - meanY
    let maxX = math.max(voltagesX)
    let maxY = math.max(voltagesY)
    let rangeX = maxX - math.min(voltagesX)
    let rangeY = maxY - math.min(voltagesY)
    let medianX = math.median(voltagesX)
    let medianY = math.median(voltagesY)
    let rmsX = math.sqrt(math.mean(math.pow(voltagesX, 2)))
    let rmsY = math.sqrt(math.mean(math.pow(voltagesY, 2)))

    return [meanX, meanY, stdX, stdY, varX, varY, madX, madY, dom, rangeX, rangeY, medianX, medianY, rmsX, rmsY]
}

export const activityClassifier = (coilOneData, coilTwoData) => {
    return dispatch => {
        voltagesX.push(coilOneData)
        voltagesY.push(coilTwoData)
        auxCounter = auxCounter + 1
        if (auxCounter == 20) {
            activity = prediction(featuresList(voltagesX, voltagesY))
            if (activity == 0) {
                activity = 'Saltar'
            } else if (activity == 1) {
                activity = 'Correr'
            } else if (activity == 2) {
                activity = 'Estar quieto '
            } else {
                activity = 'Escaleras'
            }
            voltagesX = []
            voltagesY = []
        }
        dispatch(activityMade(activity))
    }
}

const getIdAuth = async (username, password) => {
    let config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    }
    const URL = 'http://72.14.177.247/rest-auth/login/'
    const response = await fetch(URL, config)
    const userInfo = await response.json()
    const idInt = userInfo.user.id
    const id = idInt.toString()
    if (id == null) {
        return '1'
    } else {
        return id
    }
}