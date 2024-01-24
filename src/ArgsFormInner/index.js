import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';

const ArgsFormInner = createWithRemoteLoader({
    modules: ['FormInfo@List', 'FormInfo@formModule']
})(({remoteModules}) => {
    const [List, formModule] = remoteModules;
    const {Input, Switch} = formModule;
    return <List column={1} name="args" title="所需参数" defaultLength={0} list={[<Input name='name' label="参数名" rule="REQ"/>,
        <Input name='label' label="显示名称" rule="REQ"/>, <Switch name="required" label="是否必须" defaultValue={true}/>]}/>
});

export default ArgsFormInner;
