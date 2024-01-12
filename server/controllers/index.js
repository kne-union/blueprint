const express = require('express');
const blueprint = require('./blueprint');
const lib = require('./lib');
const model = require('./model');

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

module.exports = apis;
