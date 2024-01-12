import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';
import commonMenu from '../commonMenu.json';
import columns from "./columns";

const Module = createWithRemoteLoader({
    modules: ['Layout@TablePage', 'Global@usePreset', 'Menu']
})(({remoteModules}) => {
    const [TablePage, usePreset, Menu] = remoteModules;
    const {apis} = usePreset();

    return <TablePage name="module" {...Object.assign({}, apis.module.getList)} columns={columns} page={{
        title: "模块", menu: <Menu items={commonMenu}/>
    }}/>;
});

export default Module;
