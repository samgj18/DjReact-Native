import * as actionTypes from './actionTypes';
import AsyncStorage from "@react-native-community/async-storage";

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

export const authLogin = (email, password) => {
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
                    email: email,
                    password: password
                })
            }
            const URL = 'http://72.14.177.247/rest-auth/login/'
            const response = await fetch(URL, config)
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
            const id = await getIdAuth(email, password1)
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




const getIdAuth = async (email, password) => {
    let config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
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