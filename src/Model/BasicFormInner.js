import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';
import {Button, App} from 'antd';

const BasicFormInner = createWithRemoteLoader({
    modules: ['FormInfo', 'FormInfo@formModule', 'FormInfo@List', 'FormInfo@useFormModal', 'Global@usePreset', 'Enum']
})(({remoteModules}) => {
    const [FormInfo, formModule, List, useFormModal, usePreset, Enum] = remoteModules;
    const {Input, TextArea, AdvancedSelect, RadioGroup} = formModule;
    const {apis, ajax} = usePreset();
    const formModal = useFormModal();
    const {message} = App.useApp();
    return <>
        <FormInfo column={1} list={[<Input name="name" label="名称" rule="REQ"/>,
            <Input name="label" label="显示名称" rule="REQ"/>,
            <AdvancedSelect name="libId" label="所属库" rule="REQ" single api={Object.assign({}, apis.lib.getList, {
                transformData: (data) => {
                    return Object.assign({}, data, {
                        pageData: data.pageData.map(({id, label}) => ({value: id, label}))
                    })
                }
            })} extra={({context, close}) => {
                return <Button type="link" onClick={() => {
                    close();
                    const api = formModal({
                        title: '添加所属库', size: 'small', formProps: {
                            onSubmit: async (data) => {
                                const {data: resData} = await ajax(Object.assign({}, apis.lib.doAdd, {
                                    data: data
                                }));

                                if (resData.code === 0) {
                                    message.success('添加成功');
                                    await context.fetchApi.refresh();
                                    api.close();
                                }
                            }
                        }, children: <FormInfo column={1}
                                               list={[<Input name="name" label="名称" rule="REQ"/>,
                                                   <Input name="label" label="显示名称" rule="REQ"/>,
                                                   <TextArea name="description" label="描述"
                                                             rule="LEN-0-500"/>]}/>
                    });
                }}>添加</Button>
            }}/>, <TextArea name="description" label="描述" rule="LEN-0-500"/>]}/>
        <List column={1} name="fields" title="字段" minLength={1} isUnshift={false}
              list={[<Enum moduleName="fieldBasicType">{(fieldBasicType) => {
                  return <AdvancedSelect name="type" label="类型" rule="REQ" single api={{
                      loader: () => {
                          return {
                              totalCount: 0, pageData: []
                          };
                      }, transformData: (data) => {
                          return {
                              totalCount: data.totalCount + fieldBasicType.length,
                              pageData: [...fieldBasicType.map(({value, description}) => ({
                                  value, label: description
                              })), ...data.pageData.map(({label, id}) => {
                                  return {label, value: id};
                              })]
                          };
                      }
                  }}/>;
              }}</Enum>, <Input name="name" label="字段名" rule="REQ"/>,
                  <Input name="label" label="字段显示名称" rule="REQ"/>,
                  <RadioGroup name="isPrimaryKey" label="是否主键"
                              options={[{label: '是', value: true}, {label: '否', value: false}]}/>]}/>
    </>
});

export default BasicFormInner;
