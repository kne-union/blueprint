import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';

const BasicFormInner = createWithRemoteLoader({
    modules: ['FormInfo', 'FormInfo@formModule']
})(({remoteModules}) => {
    const [FormInfo, formModule] = remoteModules;
    const {Input} = formModule;
    return <FormInfo column={1} list={[<Input name="name" label="名称" rule="REQ"/>,
        <Input name="address" label="模板地址" rule="REQ"/>]}/>
});

export default BasicFormInner;
