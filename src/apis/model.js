const getList = {
    url: '/blueprint-api/models/list', method: 'GET'
};

const doDelete = {
    url: '/blueprint-api/models/delete', method: 'POST'
};

const doRestore = {
    url: '/blueprint-api/models/restore', method: 'POST'
};

const doEdit = {
    url: '/blueprint-api/models/edit', method: 'POST'
};

const doAdd = {
    url: '/blueprint-api/models/add', method: 'POST'
};

const apis = {doAdd, doEdit, doDelete, getList, doRestore};

export default apis;
