import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';
import ArgsValueFormInner from '../ArgsValueFormInner';
import get from 'lodash/get';

const SubElementFormInner = createWithRemoteLoader({
    modules: ['FormInfo@List', 'FormInfo@formModule', 'Global@usePreset']
})(({remoteModules, currentId}) => {
    const [List, formModule, usePreset] = remoteModules;
    const {Input, AdvancedSelect} = formModule;
    const {apis} = usePreset();
    return <List title="子元素" column={1} name="subElements" defaultLength={0}
                 list={(key, {index}, {formData}) => {
                     const currentValue = get(formData, `subElements[${index}]`, {});
                     return [<Input name="name" label="名称" rule="REQ"/>,
                         <AdvancedSelect name="type" label="元素类型" rule="REQ" single
                                         pagination={{paramsType: 'params'}}
                                         api={Object.assign({}, apis.element.getList, {
                                             params: {
                                                 disabled: 'open'
                                             }
                                         }, {
                                             transformData: (data) => {
                                                 return Object.assign({}, data, {
                                                     pageData: data.pageData.map(({id, label, dependencies}) => ({
                                                         value: id,
                                                         label,
                                                         disabled: currentId && (currentId === id || dependencies.indexOf(currentId) > -1)
                                                     }))
                                                 })
                                             }
                                         })}/>, <ArgsValueFormInner type="element" id={currentValue.type}
                                                                    display={!!(currentValue && currentValue.type)}/>];
                 }}/>
});

export default SubElementFormInner;
