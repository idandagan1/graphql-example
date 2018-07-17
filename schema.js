const {
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} = require('graphql');

const PersonType = new GraphQLObjectType({
    name: 'Person',
    description: 'Somebody that you used to know',
    fields: () => ({
        id: {
            type: GraphQLID,
            resolve: obj => obj.id,
        },
        firstName: {
            type: GraphQLString,
            resolve: obj => obj.first_name,
        },
        lastName: {
            type: GraphQLString,
            resolve: obj => obj.last_name,
        },
        fullName: {
            type: GraphQLString,
            resolve: obj => `${obj.first_name} ${obj.last_name}`,
        },
        email: {
            type: GraphQLString,
            description: 'Where to send junk mail',
        },
        friends: {
            type: new GraphQLList(PersonType),
            description: 'People who lent you money',
            resolve: (obj, args, { loaders }) =>
                loaders.person.loadManyByURL(obj.friends),
        },
    }),
});


module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',

        fields: () => ({
            person: {
                type: PersonType,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLID) },
                },
                resolve: (root, args, { loaders }) => loaders.person.load(args.id),
            },
        })
    })
})
