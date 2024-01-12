import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';

const BasicFormInner = createWithRemoteLoader({
    modules: ['FormInfo', 'FormInfo@formModule']
})(({remoteModules}) => {
    const [FormInfo, formModule] = remoteModules;
    const {Input, TextArea} = formModule;
    return <FormInfo column={1} title="基本信息" list={[<Input name="name" label="名称" rule="REQ LEN-0-50"/>,
        <Input name="address" label="模板地址" rule="REQ"/>,
        <TextArea block name="description" label="描述" rule="REQ LEN-0-500"/>]}/>
});

export default BasicFormInner;
