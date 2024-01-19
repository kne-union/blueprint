const {default: BluePrint, globalPreset} = blueprint;
const {createWithRemoteLoader} = removeLoader;

const BaseExample = createWithRemoteLoader({
    modules: ['Global@PureGlobal', 'Layout']
})(({remoteModules}) => {
    const [Global, Layout] = remoteModules;
    return <Global preset={globalPreset}>
        <Layout>
            <BluePrint/>
        </Layout>
    </Global>;
});

render(<BaseExample/>);
