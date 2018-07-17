const DataLoader = require('dataloader');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const users = require('./users.json');

const app = express();
const PORT = process.env.PORT || 4000;

const getPerson = id => (users.filter(_u => _u.id === +id) || [])[0];

app.use(graphqlHTTP(req => {
    const cacheMap = new Map();
    const personLoader = new DataLoader(keys => Promise.all(keys.map(getPerson)), { cacheMap });
    const loaders = { person: personLoader };
    return {
        context: { loaders },
        graphiql: true,
        schema,
    };
}));

app.listen(PORT,() => {
    console.log(`Server listening on port ${PORT}`);
});
