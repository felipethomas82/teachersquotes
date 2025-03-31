const express = require('express');

function setRoutes(app) {
    app.get('/', (req, res) => {
        res.send('Hello, World!');
    });

    app.get('/about', (req, res) => {
        res.send('About this application');
    });

    // Add more routes here as needed
}

module.exports = setRoutes;