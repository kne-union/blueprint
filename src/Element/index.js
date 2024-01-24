import React, {useRef, useState} from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';
import commonMenu from '../commonMenu.json';
import getColumns from "./getColumns";
import {Button, App, Space, Card} from "antd";
import BasicFormInner from "./BasicFormInner";
import ArgsFormInner from "../ArgsFormInner";
import ApiModelTransformFormInner from "../ApiModelTransformFormInner";
import SubElementFormInner from './SubElementFormInner';
import get from "lodash/get";
import Fetch from '@kne/react-fetch';
import OrgChart from '@kne/react-org-chart';
import style from './style.module.scss';
import '@kne/react-org-chart/dist/index.css';

const Module = createWithRemoteLoader({
    modules: ['Layout@TablePage', 'Global@usePreset', 'Menu', 'FormInfo@useFormModal', 'Modal@useModal', 'InfoPage', 'Descriptions', 'Content', 'Table', 'Filter@fields', 'Filter@getFilterValue', 'Common@SearchInput', 'FormInfo', 'FormInfo@formModule']
})(({remoteModules}) => {
    const [TablePage, usePreset, Menu, useFormModal, useModal, InfoPage, Descriptions, Content, Table, filterFields, getFilterValue, SearchInput, FormInfo, formModule] = remoteModules;
    const ref = useRef();
    const {apis, ajax} = usePreset();
    const formModal = useFormModal();
    const modal = useModal();
    const [keyword, setKeyword] = useState('');

    const {Input} = formModule;

    const showDetail = ({colItem}) => {
        modal({
            title: '元素详情', children: <Fetch {...Object.assign({}, apis.element.getDetail, {
                params: {id: colItem.id}
            })} render={({data}) => {
                const dependenciesMap = new Map((data.dependencies || []).map((item) => [item.id, item]));
                return <InfoPage>
                    <InfoPage.Part title="基本信息">
                        <Descriptions dataSource={[[{label: "编号", content: data['id']}], [{
                            label: "名称", content: data['name']
                        }, {
                            label: "显示名称", content: data['label']
                        }], [{label: '模板地址', content: data['address']}, {
                            label: '状态', content: !data.disabledAt ? '启用' : '禁用'
                        }], [{label: '描述', content: data['description']}]]}/>
                    </InfoPage.Part>
                    {data.subElements && data.subElements.length > 0 && <InfoPage.Part title="子元素">
                        {data.subElements.map((item) => {
                            const element = dependenciesMap.get(item['type']);
                            const argsMap = new Map((element.args || []).map((item) => [item.name, item]));
                            return <InfoPage.Part key={item.name} title={item.name}>
                                <Descriptions dataSource={[[{label: '名称', content: item['name']}, {
                                    label: '类型', content: <Button className="btn-no-padding"
                                                                    type="link" onClick={() => {
                                        showDetail({colItem: element});
                                    }}>{get(element, 'label', '')}</Button>
                                }], [{
                                    label: '参数',
                                    content: item.args && Object.keys(item.args).length > 0 ?
                                        <Content list={Object.keys(item.args).map((key) => {
                                            return {label: get(argsMap.get(key), 'label', ''), content: item.args[key]}
                                        })}/> : '-'
                                }]]}/>
                            </InfoPage.Part>;
                        })}
                    </InfoPage.Part>}
                    {data.dependencies && data.dependencies.length > 0 && <InfoPage.Part title="依赖元素">
                        {data.dependencies.map((item) => {
                            return <InfoPage.Part key={item.name} title={item.label}>
                                <Descriptions dataSource={[[{label: "编号", content: item['id']}], [{
                                    label: "名称", content: item['name']
                                }, {
                                    label: "显示名称", content: <Button className="btn-no-padding"
                                                                        type="link" onClick={() => {
                                        showDetail({colItem: item});
                                    }}>{get(item, 'label', '')}</Button>
                                }], [{label: '模板地址', content: item['address']}], [{
                                    label: '描述', content: item['description']
                                }]]}/>
                            </InfoPage.Part>
                        })}
                    </InfoPage.Part>}
                    {data.args && data.args.length > 0 && <InfoPage.Part title="所需参数">
                        <Table rowKey="name" dataSource={data.args} columns={[{
                            name: 'name', title: '名称', type: 'other'
                        }, {
                            name: 'label', title: '显示名称', type: 'other'
                        }]}/>
                    </InfoPage.Part>}
                    {data.apis && data.apis.length > 0 && <InfoPage.Part title="依赖接口">
                        <Table rowKey="name" dataSource={data.apis} columns={[{
                            name: 'name', title: '接口名', type: 'other'
                        }, {
                            name: 'path', title: '调用路径', type: 'other'
                        }]}/>
                    </InfoPage.Part>}
                </InfoPage>;
            }}/>, footerButtons: [{
                children: "取消",
            }, {
                type: "primary", children: "生成", autoClose: false
            }]
        });
    };

    const {message} = App.useApp();

    const [filter, setFilter] = useState([{
        "name": "disabled", "label": "状态", "value": {
            "label": "启用", "value": "open"
        }
    }]);

    const {AdvancedSelectFilterItem} = filterFields;

    return <TablePage name="element" {...Object.assign({}, apis.element.getList, {
        params: Object.assign({}, getFilterValue(filter), {keyword})
    })} ref={ref} columns={[...getColumns({
        showDetail
    }), {
        name: "options", title: "操作", type: "options", fixed: "right", valueOf: (item) => [{
            children: '生成', disabled: !!item.disabledAt, onClick: () => {
                const formModalApi = formModal({
                    title: '元素生成', size: 'large', formProps: {
                        onSubmit: async (data) => {
                            const {data: resData} = await ajax(Object.assign({}, apis.element.doGenerate, {
                                data: Object.assign({}, data, {id: item.id})
                            }));

                            if (resData.code === 0) {
                                message.success('元素生成成功');
                                formModalApi.close();
                            }
                        }
                    }, children: <Fetch {...Object.assign({}, apis.element.getDetail, {
                        params: {id: item.id}
                    })} render={({data}) => {
                        const dependenciesMap = new Map((data.dependencies || []).map((item) => [item.id, item]));

                        const render = (nodeList) => {
                            if (!(nodeList && nodeList.length > 0)) {
                                return null;
                            }
                            return nodeList.map(({name, args, type}) => {
                                const data = dependenciesMap.get(type);

                                const needArgs = (data.args || []).filter((item) => !get(args, item.name));
                                return <OrgChart.Node key={name}
                                                      label={<Card className={style['item-box']} title={<Space>
                                                          {data['label']}{data['id']}</Space>} hoverable size="small"
                                                                   onClick={() => {
                                                                       showDetail({colItem: data});
                                                                   }}>
                                                          <Space direction="vertical"
                                                                 onClick={(e) => e.stopPropagation()}>
                                                              {args && <Content list={Object.keys(args).map((key) => {
                                                                  return {
                                                                      label: key, content: args[key]
                                                                  };
                                                              })}/>}
                                                              {needArgs.length > 0 && <FormInfo title="所需参数"
                                                                                                list={needArgs.map((item) =>
                                                                                                    <Input block
                                                                                                           name={`args.${name}.${item.name}`}
                                                                                                           label={item.label}
                                                                                                           rule={item.required === true ? "REQ" : ""}/>)}/>}
                                                          </Space>
                                                      </Card>}>{render(data.subElements)}</OrgChart.Node>
                            });
                        };

                        return <OrgChart className={style['chart']}
                                         label={<Card className={style['item-box']} title={<Space>
                                             {data['label']}{data['id']}</Space>} hoverable size="small"
                                                      onClick={() => {
                                                          showDetail({colItem: data});
                                                      }}>
                                             <Space direction="vertical" onClick={(e) => e.stopPropagation()}>
                                                 <Descriptions
                                                     dataSource={[[{label: '模板地址', content: data['address']}], [{
                                                         label: '描述', content: data['description']
                                                     }]]}/>
                                                 {data.args && data.args.length > 0 && <FormInfo title="所需参数"
                                                                                                 list={data.args.map((item) =>
                                                                                                     <Input block
                                                                                                            name={`args.${data.name}.${item.name}`}
                                                                                                            label={item.label}
                                                                                                            rule={item.required === true ? "REQ" : ""}/>)}/>}
                                             </Space>
                                         </Card>}>
                            {render(data.subElements)}
                        </OrgChart>
                    }}/>
                });
            }
        }, {
            children: item.disabledAt ? '启用' : '禁用', onClick: async () => {
                const {data: resData} = await ajax(Object.assign({}, item.disabledAt ? apis.element.doRestore : apis.element.doDelete, {
                    data: {id: item.id}
                }));

                if (resData.code === 0) {
                    message.success('操作成功');
                    ref.current.refresh();
                }
            }
        }, {
            children: '编辑', onClick: () => {
                const formModalApi = formModal({
                    title: '编辑元素', size: 'small', formProps: {
                        data: item, onSubmit: async (data) => {
                            const {data: resData} = await ajax(Object.assign({}, apis.element.doEdit, {
                                data: Object.assign({
                                    apis: [], args: [], subElements: []
                                }, data, {id: item.id})
                            }));

                            if (resData.code === 0) {
                                message.success('修改成功');
                                formModalApi.close();
                                ref.current.reload();
                            }
                        }
                    }, children: <Space direction="vertical">
                        <BasicFormInner/>
                        <SubElementFormInner currentId={item.id}/>
                        <ArgsFormInner/>
                        <ApiModelTransformFormInner/>
                    </Space>
                });
            }
        }, {
            children: '复制', onClick: () => {
                const formModalApi = formModal({
                    title: '复制元素', size: 'small', formProps: {
                        data: item, onSubmit: async (data) => {
                            const {data: resData} = await ajax(Object.assign({}, apis.element.doAdd, {
                                data: Object.assign({
                                    apis: [], args: [], subElements: []
                                }, data)
                            }));

                            if (resData.code === 0) {
                                message.success('复制成功');
                                formModalApi.close();
                                ref.current.reload();
                            }
                        }
                    }, children: <Space direction="vertical">
                        <BasicFormInner/>
                        <SubElementFormInner/>
                        <ArgsFormInner/>
                        <ApiModelTransformFormInner/>
                    </Space>
                });
            }
        }]
    }]} pagination={{
        paramsType: 'params'
    }} page={{
        title: "元素", filter: {
            value: filter,
            onChange: setFilter,
            list: [[<AdvancedSelectFilterItem name="disabled" label="状态" single api={{
                loader: () => {
                    return {
                        pageData: [{label: '启用', value: 'open'}, {
                            label: '禁用', value: 'close'
                        }]
                    }
                }
            }}/>, <AdvancedSelectFilterItem name="dependencies" label="依赖元素" pagination={{paramsType: 'params'}}
                                            api={Object.assign({}, apis.element.getList, {
                                                transformData: (data) => {
                                                    return Object.assign({}, data, {
                                                        pageData: data.pageData.map(({id, label}) => ({
                                                            value: id, label
                                                        }))
                                                    })
                                                }
                                            })}/>]]
        }, titleExtra: <Space>
            <SearchInput value={keyword} onSearch={setKeyword} placeholder="请输入关键字:编号,名称,显示名称,地址,描述"/>
            <Button type="primary" onClick={() => {
                const formModalApi = formModal({
                    title: '添加元素', size: 'small', formProps: {
                        onSubmit: async (data) => {
                            const {data: resData} = await ajax(Object.assign({}, apis.element.doAdd, {
                                data
                            }));

                            if (resData.code === 0) {
                                message.success('添加成功');
                                formModalApi.close();
                                ref.current.reload();
                            }
                        }
                    }, children: <Space direction="vertical">
                        <BasicFormInner/>
                        <SubElementFormInner/>
                        <ArgsFormInner/>
                        <ApiModelTransformFormInner/>
                    </Space>
                });
            }}>添加</Button>
        </Space>, menu: <Menu items={commonMenu}/>
    }}/>;
});

export default Module;
