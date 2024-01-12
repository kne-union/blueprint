import {preset as remoteLoaderPreset} from '@kne/remote-loader';

window.PUBLIC_URL = window.runtimePublicPath || process.env.PUBLIC_URL;
window.STATIC_BASE_URL = window.runtimeStaticBaseUrl || "http://uc.dev.fatalent.cn";
window.ICONFONT_URL = (window.runtimeStaticBaseUrl || "http://uc.dev.fatalent.cn") + "/iconfont";

remoteLoaderPreset({
    remotes: {
        default: {
            remote: 'components-core', url: window.STATIC_BASE_URL, defaultVersion: '1.0.0'
        }
    }
});
