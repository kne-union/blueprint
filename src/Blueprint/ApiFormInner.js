import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';

const ApiFormInner = createWithRemoteLoader({
    modules: ['FormInfo@List', 'FormInfo@formModule']
})(({remoteModules}) => {
    const [List, formModule] = remoteModules;
    const {Input, TextArea} = formModule;
    return <List column={1} title="API信息" name="apis" list={[<Input name="path" label="调用路径" rule="REQ LEN-0-50"/>,
        <Input name="url" label="URL" rule="REQ"/>, <Input name="method" label="Method" rule="REQ"/>,
        <TextArea name="transformResponse" label="transformResponse"/>]}/>
});

export default ApiFormInner;
