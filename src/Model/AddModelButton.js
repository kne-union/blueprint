import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';
import {App, Button} from 'antd';
import BasicFormInner from "./BasicFormInner";

const AddModelButton = createWithRemoteLoader({
    modules: ['FormInfo@useFormModal', 'Global@usePreset']
})(({remoteModules, onSuccess, onClick, ...props}) => {
    const [useFormModal, usePreset] = remoteModules;
    const formModal = useFormModal();
    const {apis, ajax} = usePreset();
    const {message} = App.useApp();

    return <Button {...props} onClick={(e) => {
        onClick && onClick(e);
        const modalApi = formModal({
            title: '添加模型', size: 'small', formProps: {
                onSubmit: async (data) => {
                    const {data: resData} = await ajax(Object.assign({}, apis.model.doAdd, {
                        data
                    }));
                    if (resData.code === 0) {
                        message.success('添加成功');
                        modalApi.close();
                        onSuccess && onSuccess();
                    }
                }
            }, children: <>
                <BasicFormInner/>
            </>
        });
    }}/>
});

export default AddModelButton;
