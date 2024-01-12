import React from 'react';
import {preset as fetchPreset} from '@kne/react-fetch';
import axios from 'axios';
import {Spin, Empty, Result, message} from 'antd';
import apis from './apis';
import enums from './enums';

const ajax = axios.create({
    validateStatus: function () {
        return true;
    }
});

ajax.interceptors.request.use(config => {
    if (config.method.toUpperCase() !== 'GET' && !config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
});

ajax.interceptors.response.use(response => {
    if ((response.status !== 200 || (response.data.hasOwnProperty('code') && response.data.code !== 0)) && response.config.showError !== false) {
        message.error(response.data.msg || '请求发生错误');
    }
    return response;
});


fetchPreset({
    ajax, loading: (<Spin
        style={{
            position: "absolute", left: "50%", padding: "10px", transform: "translateX(-50%)",
        }}
    />), error: <Result status="error" title="请求发生错误"/>, empty: <Empty/>, transformResponse: (response) => {
        const {data} = response;
        response.data = {
            code: data.code === 0 ? 200 : data.code, msg: data.msg, results: data.data,
        };
        return response;
    },
});

export const globalPreset = {
    ajax, apis, enums
};
