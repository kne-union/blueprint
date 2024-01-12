import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';
import columns from './columns';
import commonMenu from '../commonMenu.json';
import {Button} from 'antd';
import BasicFormInner from './BasicFormInner';
import ModulesFormInner from './ModulesFormInner';
import ArgsFormInner from '../ArgsFormInner';
import ApiFormInner from './ApiFormInner';

const Blueprint = createWithRemoteLoader({
    modules: ['Layout@TablePage', 'Global@usePreset', 'Menu', 'FormInfo@useFormModal']
})(({remoteModules}) => {
    const [TablePage, usePreset, Menu, useFormModal] = remoteModules;
    const {apis} = usePreset();

    const formModal = useFormModal();

    return <TablePage name="blueprint" {...Object.assign({}, apis.blueprint.getList)} columns={columns} page={{
        title: "蓝图", menu: <Menu items={commonMenu}/>, titleExtra: <Button type="primary" onClick={() => {
            formModal({
                size: 'small', title: "添加蓝图", children: <>
                    <BasicFormInner/>
                    <ArgsFormInner />
                    <ModulesFormInner />
                </>
            });
        }}>添加</Button>
    }}/>;
});

export default Blueprint;
