import {useEffect} from 'react';
import ExampleDriver from '@kne/example-driver';
import readme from './readme';
import get from "lodash/get";
import last from "lodash/last";
import {HashRouter} from "react-router-dom";
import './app.css';

const ContextComponent = ({children}) => {
    return <HashRouter>{children}</HashRouter>
};

const App = () => {
    const exampleStyle = get(readme, 'example.style');
    useEffect(() => {
        if (!exampleStyle) {
            return;
        }
        const dom = document.createElement('style');
        dom.innerText = exampleStyle.replace(/\n/g, '');
        document.head.append(dom);
        return () => {
            document.head.removeChild(dom);
        };
    }, [exampleStyle]);

    return <ExampleDriver isFull={get(readme, 'example.isFull')} list={get(readme, 'example.list') || []}
                          contextComponent={ContextComponent}/>
};

export default App;
