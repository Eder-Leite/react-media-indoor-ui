/* eslint-disable strict */
'use strict';

import axios from 'axios';
import decode from 'jwt-decode';
import { setToken, getToken, logout } from './Auth';

export const URL = 'http://localhost:3333/';
// export const URL = 'http://evolution.novaprodutiva.com.br/';

export const isTokenExpired = () => {

    const token = getToken();

    try {
        const decoded = decode(token);
        if (decoded.exp < Date.now() / 1000) {
            return true;
        }
        else
            return false;
    }
    catch (err) {
        return false;
    }
}

export const logoutUser = () => {
    logout();
}

export const loggedIn = () => {
    const token = getToken()
    return !!token && !isTokenExpired(token);
}

export const temPermissao = (permissao = '') => {
    try {
        const obj = getProfile();
        return obj.authorities.includes(permissao);
    } catch (error) {
        return false;
    }
}

export const temQualquerPermissao = (roles = []) => {
    for (const role of roles) {
        if (temPermissao(role)) {
            return true;
        }
    }
    return false;
}

export const getProfile = () => {
    return decode(getToken());
}

export const saveFile = (data, name) => {

    try {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.log(error);
    }
}

export const refreshToken = async () => {

    const body = 'grant_type=refresh_token';

    await ApiRefreshToken({
        method: 'post',
        url: 'oauth/token',
        data: body
    }).then(resp => {
        setToken(resp.data.access_token);
    })
        .catch(error => {
            console.log(error);
        });

    if (isTokenExpired()) {
        console.log('refreshToken expirado!');

        setTimeout(() => {
            logoutUser();
            window.location = '/';
        }, 300);
    }
}

export const ApiRefreshToken = axios.create({
    baseURL: URL,
    withCredentials: true,
    headers: {
        'authorization': 'Basic c2Vydmlkb3I6c2Vydmlkb3I=',
        'content-Type': 'application/x-www-form-urlencoded'
    }
});

export const ApiCadastro = axios.create({
    baseURL: URL,
    withCredentials: true,
    headers: {
        'authorization': 'Basic c2Vydmlkb3I6c2Vydmlkb3I=',
        'content-Type': 'application/json'
    }
});

export const ApiRecuperaSenha = axios.create({
    baseURL: URL,
    withCredentials: true,
    headers: {
        'authorization': 'Basic c2Vydmlkb3I6c2Vydmlkb3I=',
        'content-Type': 'application/json'
    }
});

export const ApiLogin = axios.create({
    baseURL: URL,
    withCredentials: true,
    headers: {
        'authorization': 'Basic c2Vydmlkb3I6c2Vydmlkb3I=',
        'content-Type': 'application/x-www-form-urlencoded'
    }
});

const Api = axios.create({
    baseURL: URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'Application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    proxy: {
        host: '127.0.0.1',
        port: 3333
    }
});

// Api.interceptors.request.use(async config => {

//     if (isTokenExpired()) {
//         console.log('token expirado!');

//         await refreshToken();

//         config.headers.Authorization = `Bearer ${getToken()}`;
//     } else {
//         config.headers.Authorization = `Bearer ${getToken()}`;
//     }

//     return config;

// });

export default Api;