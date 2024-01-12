import React, {useRef} from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';
import commonMenu from '../commonMenu.json';
import getColumns from "./getColumns";
import {App, Button} from 'antd';
import BasicFormInner from './BasicFormInner';

const Model = createWithRemoteLoader({
    modules: ['Layout@TablePage', 'Global@usePreset', 'Menu', 'FormInfo@useFormModal', 'Modal@useModal', 'InfoPage']
})(({remoteModules}) => {
    const [TablePage, usePreset, Menu, useFormModal, useModal, InfoPage] = remoteModules;
    const {ajax, apis} = usePreset();
    const {message} = App.useApp();
    const formModal = useFormModal();
    const modal = useModal();
    const ref = useRef();

    return <TablePage ref={ref} name="model" {...Object.assign({}, apis.model.getList)} columns={[...getColumns({
        showDetail: () => {
            modal({
                title: '模型详情', children: <InfoPage>
                    <InfoPage.Part title="基本信息">基本信息基本信息基本信息基本信息</InfoPage.Part>
                    <InfoPage.Part title="字段信息">基本信息基本信息基本信息基本信息基本信息</InfoPage.Part>
                </InfoPage>, footer: null
            });
        }
    }), {
        name: "options", title: "操作", type: "options", fixed: "right", valueOf: (item) => [{
            children: '编辑', onClick: () => {
                const modalApi = formModal({
                    title: '编辑模型', size: 'small', formProps: {
                        data: item, onSubmit: async (data) => {
                            const {data: resData} = await ajax(Object.assign({}, apis.model.doEdit, {
                                data: Object.assign({}, data, {id: item.id})
                            }));
                            if (resData.code === 0) {
                                message.success('修改成功');
                                modalApi.close();
                                ref.current.refresh();
                            }
                        }
                    }, children: <>
                        <BasicFormInner/>
                    </>
                });
            }
        }, {
            children: item.disabledAt ? '启用' : '禁用', onClick: async () => {
                const {data: resData} = await ajax(Object.assign({}, item.disabledAt ? apis.model.doRestore : apis.model.doDelete, {
                    data: {id: item.id}
                }));

                if (resData.code === 0) {
                    message.success('操作成功');
                    ref.current.refresh();
                }
            }
        }]
    }]} page={{
        title: "模型", titleExtra: <Button type="primary" onClick={() => {
            const modalApi = formModal({
                title: '添加模型', size: 'small', formProps: {
                    onSubmit: async (data) => {
                        const {data: resData} = await ajax(Object.assign({}, apis.model.doAdd, {
                            data
                        }));
                        if (resData.code === 0) {
                            message.success('添加成功');
                            modalApi.close();
                            ref.current.refresh();
                        }
                    }
                }, children: <>
                    <BasicFormInner/>
                </>
            });
        }}>添加</Button>, menu: <Menu items={commonMenu}/>
    }}/>;
});

export default Model;
