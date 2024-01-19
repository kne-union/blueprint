const db = require('./db');
const controllers = require('./controllers');
const bodyParser = require('body-parser');

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
    app.use('/blueprint-api', controllers);
};
