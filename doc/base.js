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
