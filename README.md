
# blueprint


### 安装

```shell
npm i --save @kne/blueprint
```


### 概述

这里填写组件概要说明


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- blueprint(@kne/blueprint),removeLoader(@kne/remote-loader)

```jsx
const {default: BluePrint} = blueprint;
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

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

