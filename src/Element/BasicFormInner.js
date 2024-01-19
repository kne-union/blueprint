import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';

const BasicFormInner = createWithRemoteLoader({
    modules: ['FormInfo', 'FormInfo@formModule']
})(({remoteModules}) => {
    const [FormInfo, formModule] = remoteModules;
    const {Input, TextArea} = formModule;
    return <FormInfo column={1} list={[<Input name="name" label="名称" rule="REQ"/>,
        <Input name="label" label="显示名称" rule="REQ"/>,
        <Input name="address" label="模板地址" rule="REQ"/>,
        <TextArea name="description" label="描述" rule="LEN-0-500"/>]}/>
});

export default BasicFormInner;
