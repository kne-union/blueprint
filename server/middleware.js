const db = require('./db');
const controllers = require('./controllers');
const bodyParser = require('body-parser');

module.exports = (app, options = {}) => {
    const models = db(options.db);
    app.config = options;
    app.models = models;
    app.use(bodyParser.json());
    app.use((req, res, next) => {
        req.models = models;
        next();
    });
    app.use('/blueprint-api', controllers);
};
