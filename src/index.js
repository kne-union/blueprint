import {globalPreset} from './preset';
import React from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';
import {Routes, Route} from 'react-router-dom';
import Blueprint from './Blueprint';
import Module from './Module';
import Page from './Page';
import Action from './Action';
import Element from './Element';
import Model from './Model';

const App = createWithRemoteLoader({
    modules: ['Global@PureGlobal', 'Layout@Page', 'Menu']
})(({remoteModules}) => {
    const [PureGlobal] = remoteModules;
    return <PureGlobal preset={globalPreset}>
        <Routes>
            <Route path="/modules" element={<Module/>}/>
            <Route path="/pages" element={<Page/>}/>
            <Route path="/actions" element={<Action/>}/>
            <Route path="/elements" element={<Element/>}/>
            <Route path="/model" element={<Model/>}/>
            <Route index element={<Blueprint/>}/>
        </Routes>
    </PureGlobal>;
});


export default App;
