import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';
import commonMenu from '../commonMenu.json';
import columns from "./columns";
import BasicFormInner from './BasicFormInner';
import {Button} from 'antd';
import ArgsFormInner from "../ArgsFormInner";
import ApiModelTransformFormInner from '../ApiModelTransformFormInner';

const Module = createWithRemoteLoader({
    modules: ['Layout@TablePage', 'Global@usePreset', 'Menu', 'FormInfo@useFormModal']
})(({remoteModules}) => {
    const [TablePage, usePreset, Menu, useFormModal] = remoteModules;
    const {apis} = usePreset();
    const formModal = useFormModal();

    return <TablePage name="page" {...Object.assign({}, apis.page.getList)} columns={columns} page={{
        title: "页面", titleExtra: <Button type="primary" onClick={() => {
            formModal({
                title: '添加页面', size: 'small', children: <>
                    <BasicFormInner/>
                    <ArgsFormInner />
                    <ApiModelTransformFormInner />
                </>
            });
        }}>添加</Button>, menu: <Menu items={commonMenu}/>
    }}/>;
});

export default Module;
