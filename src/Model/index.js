import React, {useRef} from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';
import commonMenu from '../commonMenu.json';
import getColumns from "./getColumns";
import {App} from 'antd';
import BasicFormInner from './BasicFormInner';
import get from 'lodash/get';
import AddModelButton from './AddModelButton';

const Model = createWithRemoteLoader({
    modules: ['Layout@TablePage', 'Global@usePreset', 'Menu', 'FormInfo@useFormModal', 'Modal@useModal', 'InfoPage', 'Descriptions']
})(({remoteModules}) => {
    const [TablePage, usePreset, Menu, useFormModal, useModal, InfoPage, Descriptions] = remoteModules;
    const {ajax, apis} = usePreset();
    const {message} = App.useApp();
    const formModal = useFormModal();
    const modal = useModal();
    const ref = useRef();

    return <TablePage ref={ref} name="model" {...Object.assign({}, apis.model.getList)} columns={[...getColumns({
        showDetail: ({colItem}) => {
            modal({
                title: '模型详情', children: <InfoPage>
                    <InfoPage.Part title="基本信息">
                        <Descriptions dataSource={[[{label: "编号", content: colItem['id']}], [{
                            label: "名称", content: colItem['name']
                        }, {
                            label: "显示名称", content: colItem['label']
                        }], [{label: '所属库', content: get(colItem['Lib'], 'label', '')}, {
                            label: '状态', content: !colItem.disabledAt ? '启用' : '禁用'
                        }], [{label: '描述', content: colItem['description']}]]}/>
                    </InfoPage.Part>
                    <InfoPage.Part title="字段信息">
                        {get(colItem, 'fields').map(({name, label, type, isPrimaryKey}) => {
                            return <InfoPage.Part title={label} key={name}>
                                <Descriptions dataSource={[[{label: '字段名称', content: name}, {
                                    label: '字段显示名称', content: label
                                }], [{label: '类型', content: type}, {
                                    label: '是否主键', content: isPrimaryKey ? '是' : '否'
                                }]]}/>
                            </InfoPage.Part>
                        })}
                    </InfoPage.Part>
                </InfoPage>, footer: null
            });
        }, showLibDetail: ({colItem}) => {
            modal({
                title: '所属库详情', children: <InfoPage>
                    <Descriptions dataSource={[[{label: "编号", content: get(colItem['Lib'], 'id')}], [{
                        label: "名称", content: get(colItem['Lib'], 'name')
                    }, {
                        label: "显示名称", content: get(colItem['Lib'], 'label')
                    }], [{label: '描述', content: get(colItem['Lib'], 'description')}]]}/>
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
                                ref.current.reload();
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
        title: "模型", titleExtra: <AddModelButton type="primary" onSuccess={() => {
            ref.current.refresh();
        }}>添加</AddModelButton>, menu: <Menu items={commonMenu}/>
    }}/>;
});

export default Model;
