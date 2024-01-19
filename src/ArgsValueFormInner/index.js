import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import get from 'lodash/get';

const ArgsValueFormInner = createWithRemoteLoader({
    modules: ['Global@usePreset', 'FormInfo', 'FormInfo@formModule']
})(({remoteModules, type, id}) => {
    const [usePreset, FormInfo, formModule] = remoteModules;
    const {Input} = formModule;
    const {apis} = usePreset();
    return <Fetch {...Object.assign({}, get(apis, `${type}.getDetail`), {
        params: {id}
    })} render={({data}) => {
        return <>
            {data.args && data.args.length > 0 &&
                <FormInfo title="元素参数" column={1} list={data.args.map(({name, label}) => {
                    return <Input label={label} name={`args.${name}`}/>;
                })}/>}
        </>;
    }}/>;
});

export default ArgsValueFormInner;
