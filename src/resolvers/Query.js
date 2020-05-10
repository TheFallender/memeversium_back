import 'babel-polyfill';
import * as uuid from 'uuid';
import {MongoClient, ObjectID} from 'mongodb';

//Require Bcrypt
const bcrypt = require('bcrypt');

const Query = {
    //############################# LOGS #############################
    //Login
    userLogin: async (parent, args, ctx, info) => {
        //Ctx and args
        const {email, password} = args;
        const {userCLT} = ctx;

        //Check if the user exists (email)
        const userEmail = await userCLT.findOne({email});
        if (!userEmail)
            return {msgInfo: `ERROR - Invalid email/password.`};

        //Password crypt
        const isValid = await bcrypt.compare(userEmail.salt + password, userEmail.password);
        if (!isValid)
            return {msgInfo: `ERROR - Invalid email/password.`};

        //Token gen
        const token = uuid.v4();
        await userCLT.findOneAndUpdate({email}, {$set:{token}}, {returnOriginal: false});

        //Return Token
        return {
            msgInfo: `SUCCESS`,
            data: [token],
            user: [{
                _id: userEmail._id,
                user: userEmail.user,
                admin: userEmail.admin,
                blocked: userEmail.blocked,
            }]
        };
    },


    //Logout
    userLogout: async (parent, args, ctx, info) => {
        //Ctx and args
        const {userID, token} = args;
        const {userCLT} = ctx;

        //Check if the user exists and remove the token
        const user = await userCLT.findOneAndUpdate({_id: ObjectID(userID), token}, {$set:{token: null}}, {returnOriginal: false});
        if (!user.value)
            return {msgInfo: `ERROR - Invalid email/token.`};

        return {msgInfo: `SUCCESS`};
    },
    //############################# END LOGS #############################



    //############################# MEMES #############################
    //Meme List
    memeList: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {memeCLT} = ctx;

        //Search memes inside collection
        const result = await memeCLT.find().toArray();

        //Return Memes
        return {msgInfo: `SUCCESS`, meme: result};
    },


    //Best Memes
    bestMemesList: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {memeCLT} = ctx;

        //Search memes inside collection
        const result = await memeCLT.find({best: true}).toArray();

        //Return Memes
        return {msgInfo: `SUCCESS`, meme: result};
    },


    //Last List
    lastMemesList: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {memeCLT} = ctx;

        //Search memes inside collection and sort them
        let result = await memeCLT.find().toArray();
        result = result.sort((a,b) => b.date - a.date);

        //Return Memes
        return {msgInfo: `SUCCESS`, meme: result};
    },


    //Memes by User
    userMemes: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {userID} = args;
        const {userCLT, memeCLT} = ctx;

        //Check if the user exists
        const user = await userCLT.findOne({_id: ObjectID(userID)});
        if (!user)
            return {msgInfo: `ERROR - User not found.`};

        //Search memes inside collection
        const result = await memeCLT.find({user: userID}).toArray();

        //Return Memes
        return {msgInfo: `SUCCESS`, meme: result};
    },
    //############################# END MEMES #############################



    //############################# ADMIN #############################
    //Select as best meme
    selectAsBestMeme: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {memeID, adminID, adminToken} = args;
        const {userCLT, memeCLT} = ctx;

        //Check if the user exists and is an admin
        const user = await userCLT.findOne({_id: ObjectID(adminID), token: adminToken, admin: true});
        if (!user)
            return {msgInfo: `ERROR - Invalid email/token for Admin.`};

        //Search for the meme
        const meme = await memeCLT.findOne({_id: ObjectID(memeID)});

        if(!meme)
            return {msgInfo: `ERROR - Meme not found.`};

        //Update the meme best status
        await memeCLT.findOneAndUpdate({_id: ObjectID(memeID)}, {$set:{best: !meme.best}}, {returnOriginal: false});

        //Return info
        return {msgInfo: `SUCCESS`};
    },


    //Block User
    blockUser: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {userID, adminID, adminToken} = args;
        const {userCLT} = ctx;

        //Check if the user exists and is an admin
        const user = await userCLT.findOne({_id: ObjectID(adminID), token: adminToken, admin: true});
        if (!user)
            return {msgInfo: `ERROR - Invalid email/token for Admin.`};

        //Search for the user
        const userFound = await userCLT.findOne({_id: ObjectID(userID)});
        if(!userFound)
            return {msgInfo: `ERROR - User not found.`};

        //Update the user blocked status
        await userCLT.findOneAndUpdate({_id: ObjectID(userID)}, {$set:{blocked: !userFound.blocked}}, {returnOriginal: false});

        //Return info
        return {msgInfo: `SUCCESS`};
    },


    //Blocked Users
    blockedUsers: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {adminID, adminToken} = args;
        const {userCLT} = ctx;

        //Check if the user exists and is an admin
        const user = await userCLT.findOne({_id: ObjectID(adminID), token: adminToken, admin: true});
        if (!user)
            return {msgInfo: `ERROR - Invalid email/token for Admin.`};

        //Search for the user
        const usersFound = await userCLT.find({blocked: true}).toArray();

        usersFound.map(element => (
            {
                _id: element._id,
                user: element.user,
                admin: element.admin,
                blocked: element.blocked
            }
        ));

        //Return info
        return {msgInfo: `SUCCESS`, user: usersFound};
    },
    //############################# END ADMIN #############################
}

export default Query;