const getList = {
    url: '/blueprint-api/elements/list', method: 'GET'
};

const doDelete = {
    url: '/blueprint-api/elements/delete', method: 'POST'
};

const doRestore = {
    url: '/blueprint-api/elements/restore', method: 'POST'
};

const doEdit = {
    url: '/blueprint-api/elements/edit', method: 'POST'
};

const doAdd = {
    url: '/blueprint-api/elements/add', method: 'POST'
};

const getDetail = {
    url: '/blueprint-api/elements/get', method: 'GET'
};

const doGenerate = {
    url: '/blueprint-api/elements/generate', method: 'POST'
};

const apis = {doAdd, doEdit, doDelete, doRestore, getDetail, getList, doGenerate};

export default apis;
