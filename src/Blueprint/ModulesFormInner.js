import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';

const ModulesFormInner = createWithRemoteLoader({
    modules: ['FormInfo@List', 'FormInfo@formModule']
})(({remoteModules}) => {
    const [List, formModule] = remoteModules;
    const {Input} = formModule;
    return <List title="模块信息" minLength={1} column={1} name="modules"
                 list={[<Input name="type" label="模块类型" rule="REQ"/>,
                     <Input name="name" label="英文名" rule="REQ"/>, <Input name="label" label="名称" rule="REQ"/>]}/>
});

export default ModulesFormInner;
