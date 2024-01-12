import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';

const ApiModelTransformFormInner = createWithRemoteLoader({
    modules: ['FormInfo@List', 'FormInfo@formModule']
})(({remoteModules}) => {
    const [List, formModule] = remoteModules;
    const {Input} = formModule;
    return <List column={1} title="依赖接口" name="apis" list={[<Input name="name" label="接口名" rule="REQ LEN-0-50"/>,
        <Input name="path" label="调用路径" rule="REQ LEN-0-50"/>, <Input name="model" label="数据模型" rule="REQ"/>]}/>
});

export default ApiModelTransformFormInner;
