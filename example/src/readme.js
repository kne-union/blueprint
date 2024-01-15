import * as component_3 from '@kne/blueprint';
import * as component_4 from '@kne/remote-loader';
const readmeConfig = {
    name: `@kne/blueprint`,
    description: ``,
    summary: `<p>这里填写组件概要说明</p>`,
    api: `<table>
<thead>
<tr>
<th>属性名</th>
<th>说明</th>
<th>类型</th>
<th>默认值</th>
</tr>
</thead>
</table>`,
    example: {
        isFull: false,
        className: `blueprint_9cd59`,
        style: ``,
        list: [{
    title: `这里填写示例标题`,
    description: `这里填写示例说明`,
    code: `const {default: BluePrint} = blueprint;
const {createWithRemoteLoader} = removeLoader;

const BaseExample = createWithRemoteLoader({
    modules: ['Global@PureGlobal', 'Layout']
})(({remoteModules}) => {
    const [Global, Layout] = remoteModules;
    return <Global>
        <Layout>
            <BluePrint />
        </Layout>
    </Global>;
});

render(<BaseExample/>);

`,
    scope: [{
    name: "blueprint",
    packageName: "@kne/blueprint",
    component: component_3
},{
    name: "removeLoader",
    packageName: "@kne/remote-loader",
    component: component_4
}]
}]
    }
};
export default readmeConfig;
