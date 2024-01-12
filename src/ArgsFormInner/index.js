import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';

const ArgsFormInner = createWithRemoteLoader({
    modules: ['FormInfo@List', 'FormInfo@formModule']
})(({remoteModules}) => {
    const [List, formModule] = remoteModules;
    const {Input} = formModule;
    return <List column={1} name="args" title="所需参数" list={[<Input name='name' label="参数名" rule="REQ"/>,
        <Input name='label' label="显示名称" rule="REQ"/>]}/>
});

export default ArgsFormInner;
