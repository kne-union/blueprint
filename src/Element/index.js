import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';
import commonMenu from '../commonMenu.json';
import columns from "./columns";
import {Button} from "antd";
import BasicFormInner from "../Page/BasicFormInner";
import ArgsFormInner from "../ArgsFormInner";
import ApiModelTransformFormInner from "../ApiModelTransformFormInner";

const Module = createWithRemoteLoader({
    modules: ['Layout@TablePage', 'Global@usePreset', 'Menu', 'FormInfo@useFormModal']
})(({remoteModules}) => {
    const [TablePage, usePreset, Menu,useFormModal] = remoteModules;
    const {apis} = usePreset();
    const formModal = useFormModal();
    return <TablePage name="element" {...Object.assign({}, apis.element.getList)} columns={columns} page={{
        title: "元素", titleExtra: <Button type="primary" onClick={() => {
            formModal({
                title: '添加元素', size: 'small', children: <>
                    <BasicFormInner/>
                    <ArgsFormInner />
                    <ApiModelTransformFormInner />
                </>
            });
        }}>添加</Button>, menu: <Menu items={commonMenu}/>
    }}/>;
});

export default Module;
