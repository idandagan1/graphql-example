const DataLoader = require('dataloader');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const cors = require('cors');
const users = require('./users.json');

const app = express();
const PORT = process.env.PORT || 4000;

const getUser = id => (users.filter(_u => _u.id === +id) || [])[0];

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,token');
    next();
})

app.use('/graphql', cors(), graphqlHTTP(req => {
    const cacheMap = new Map();
    const userLoader = new DataLoader(keys => Promise.all(keys.map(getUser)), { cacheMap });
    const loaders = { user: userLoader };
    return {
        context: { loaders },
        graphiql: true,
        schema,
    };
}));

app.listen(PORT,() => {
    console.log(`Server listening on port ${PORT}`);
});
