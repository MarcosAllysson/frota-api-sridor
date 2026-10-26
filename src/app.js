const express = require('express');
const createContainer = require('./container');
const createRoutes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

/** Cria a aplicação Express (separada do server.js para ser testável). */
function createApp(container = createContainer()) {
    const app = express();
    app.use(express.json());

    app.get('/health', (req, res) => res.json({ status: 'ok' }));
    app.use(createRoutes(container));

    app.use(notFound);
    app.use(errorHandler);
    return app;
}

module.exports = createApp;