require('express-async-errors');

const db = require('./db');
const controllers = require('./controllers');
const services = require('./services');
const bodyParser = require('body-parser');
const transform = require('lodash/transform');
const statuses = require('statuses');

const production = process.env.NODE_ENV === 'production';

module.exports = (app, options = {}) => {
    const {models, sequelize} = db(options.db);
    app.config = options;
    app.models = models;
    app.sequelize = sequelize;

    app.use(bodyParser.json());
    app.use((req, res, next) => {
        req.models = models;
        req.sequelize = sequelize;
        next();
    });

    app.use((req, res, next) => {
        app.services = req.services = transform(services, (result, value, key) => {
            result[key] = transform(value, (result, value, key) => {
                result[key] = value(req, res);
            }, {});
        }, {});
        next();
    });

    app.use('/blueprint-api', controllers);

    app.use((err, req, res, next) => {
        let status = err.status || err.statusCode || 500;
        if (status < 400) status = 500;
        res.statusCode = status;

        let body = {
            status: status
        };

        // show the stacktrace when not in production
        // TODO: make this an option
        if (!production) body.stack = err.stack;

        // internal server errors
        if (status >= 500) {
            console.error(err.stack);
            body.msg = statuses[status];
            res.json(body);
            return;
        }

        // client errors
        body.msg = err.message;

        if (err.code) body.code = err.code;
        if (err.name) body.name = err.name;
        if (err.type) body.type = err.type;

        res.json(body);
    });
};
