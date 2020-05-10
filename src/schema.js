//ApolloServer
const {gql} = require('apollo-server');

const typeDefs = gql`
    type Query {
        #User Logs
        userLogin(email: String!, password: String!): msg!
        getSalt(email: String!): msg!
        userLogout(userID: ID!, token: ID!): msg!

        #Meme gets      
        memeList: msg!
        bestMemesList: msg!
        lastMemesList: msg!
        userMemes(userID: ID!): msg!


        #Admin Methods
        selectAsBestMeme(memeID: ID!, adminID: ID!, adminToken: ID!): msg!
        blockUser(userID: ID!, adminID: ID!, adminToken: ID!): msg!
        blockedUsers(adminID: ID!, adminToken: ID!) : msg!
    }

    type Mutation {
        #User methods
        addUser(user: String!, email: String!, password: String!, salt: String!): msg!
        addMeme(title: String!, userID: ID!, image: String!, token: ID!): msg!
         

        #Admin Methods
        removeUser(userID: ID!, adminID: ID!, adminToken: ID!): msg!
        removeMeme(memeID: ID!,  adminID: ID!, adminToken: ID!): msg!
    }

    type Meme {
        _id: ID!
        title: String!
        image: String!
        date: String!
        best: Boolean!
        user: User!
    }

    type User {
        _id: ID!
        user: String!
        admin: Boolean!
        blocked: Boolean!
    }

    type msg {
        msgInfo: String!
        data: [String!]
        meme: [Meme!]
        user: [User!]
    }
`;

export default typeDefs;