import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';
import AddModelButton from '../Model/AddModelButton';

const ApiModelTransformFormInner = createWithRemoteLoader({
    modules: ['FormInfo@List', 'FormInfo@formModule', 'Global@usePreset']
})(({remoteModules}) => {
    const [List, formModule, usePreset] = remoteModules;
    const {Input, AdvancedSelect} = formModule;

    const {apis} = usePreset();
    return <List column={1} title="依赖接口" name="apis" defaultLength={0} list={[<Input name="name" label="接口名" rule="REQ LEN-0-50"/>,
        <Input name="path" label="调用路径" rule="REQ LEN-0-50"/>,
        <AdvancedSelect name="model" label="数据模型" single extra={({context, close}) => {
            return <AddModelButton type="link" onClick={() => {
                close();
            }} onSuccess={() => {
                context.fetchApi.refresh();
            }}>添加</AddModelButton>
        }} api={Object.assign({}, apis.model.getList, {
            transformData: (data) => {
                return Object.assign({}, data, {
                    pageData: data.pageData.map(({id, label}) => ({value: id, label}))
                })
            }
        })}/>]}/>
});

export default ApiModelTransformFormInner;
