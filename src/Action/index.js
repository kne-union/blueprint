import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';
import commonMenu from '../commonMenu.json';
import columns from "./columns";
import {Button} from "antd";
import BasicFormInner from "../Page/BasicFormInner";
import ArgsFormInner from "../ArgsFormInner";

const Action = createWithRemoteLoader({
    modules: ['Layout@TablePage', 'Global@usePreset', 'Menu', 'FormInfo@useFormModal']
})(({remoteModules}) => {
    const [TablePage, usePreset, Menu, useFormModal] = remoteModules;
    const {apis} = usePreset();
    const formModal = useFormModal();
    return <TablePage name="action" {...Object.assign({}, apis.action.getList)} columns={columns} page={{
        title: "动作", titleExtra: <Button type="primary" onClick={() => {
            formModal({
                title: '添加动作', size: 'small', children: <>
                    <BasicFormInner/>
                    <ArgsFormInner/>
                </>
            });
        }}>添加</Button>, menu: <Menu items={commonMenu}/>
    }}/>;
});

export default Action;
