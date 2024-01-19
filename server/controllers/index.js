const express = require('express');
const blueprint = require('./blueprint');
const lib = require('./lib');
const model = require('./model');
const element = require('./element');

const apis = express.Router();

apis.get('/blueprints/list', blueprint.list);
apis.post('/blueprints/add', blueprint.add);
apis.post('/blueprints/edit', blueprint.edit);
apis.post('/blueprints/delete', blueprint.del);
apis.get('/blueprints/:id', blueprint.get);

apis.get('/libs/list', lib.list);
apis.post('/libs/add', lib.add);

apis.get('/models/list', model.list);
apis.post('/models/add', model.add);
apis.post('/models/edit', model.edit);
apis.post('/models/delete', model.del);
apis.post('/models/restore', model.restore);

apis.get('/elements/get', element.get);
apis.get('/elements/list', element.list);
apis.post('/elements/add', element.add);
apis.post('/elements/edit', element.edit);
apis.post('/elements/delete', element.del);
apis.post('/elements/restore', element.restore);

module.exports = apis;
