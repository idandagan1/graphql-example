const {
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} = require('graphql');

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Some description',
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
            description: 'user primary email',
        },
        friends: {
            type: new GraphQLList(UserType),
            description: 'users friends',
            resolve: (obj, args, { loaders }) =>
                loaders.user.loadMany(obj.friends),
        },
    }),
});


module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',

        fields: () => ({
            user: {
                type: UserType,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLID) },
                },
                resolve: (root, args, { loaders }) => loaders.user.load(args.id),
            },
        })
    })
})
