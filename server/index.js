const express = require('express');
const middlewareSetUp = require('./middleware');

module.exports = (config = {}) => {
    const app = express();
    middlewareSetUp(app, config);
    app.listen(config.port || 3018);
};
