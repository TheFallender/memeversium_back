import 'babel-polyfill';
import {MongoClient, ObjectID} from 'mongodb';


const Mutation = {
    //############################# ADD #############################
    //Add User
    addUser: async (parent, args, ctx, info) => {
        //Ctx and args
        const {user, email, password, salt} = args;
        const {userCLT} = ctx;

        //Check if the user already exists (email)
        const userEmail = await userCLT.findOne({email});
        if (userEmail)
            return  {msgInfo: `ERROR - User with email ${email} already in use.`};

        //Check if the user already exists (username)
        const userName = await userCLT.findOne({user});
        if (userName)
            return {msgInfo: `ERROR - Username ${user} already taken.`};

        //Send User
        const result = await userCLT.insertOne({
            user,
            email,
            password,
            salt,
            admin: false,
            blocked: false,
            token: null
        });
      
        return {
            msgInfo: `SUCCESS`,
        };
    },


    //Add Meme
    addMeme: async (parent, args, ctx, info) => {
        //Ctx and args
        const {title, userID, image, token} = args;
        const {userCLT, memeCLT} = ctx;

        //Check if the user exists
        const user = await userCLT.findOne({_id: ObjectID(userID), token, blocked: false});
        if (!user)
            return  {msgInfo: `ERROR - Invalid user/token. Are you blocked?`};

        //Send Meme
        const result = await memeCLT.insertOne({
            title,
            image,
            date: new Date().getTime(),
            best: false,
            user: userID,
        });
        
        return {
            msgInfo: `SUCCESS`,
            meme: [
                result.ops[0]
            ],
        };
    },
    //############################# END ADD #############################



    //############################# REMOVE #############################
    //Remove User
    removeUser: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {userID, adminID, adminToken} = args;
        const {userCLT, memeCLT} = ctx;

        //Check if the user exists and is an admin
        const user = await userCLT.findOne({_id: ObjectID(adminID), token: adminToken, admin: true});
        if (!user)
            return {msgInfo: `ERROR - Invalid email/token for Admin.`};

        //Search for the user and delete it
        const userFound = await userCLT.deleteOne({_id: ObjectID(userID)});
        if(userFound.deletedCount == 0)
            return {msgInfo: `ERROR - User not found.`};

        //Delete the memes of that user
        await memeCLT.deleteMany({user: userID});

        //Return Memes
        return {msgInfo: `SUCCESS`};
    },
    

    //Remove meme
    removeMeme: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {memeID, adminID, adminToken} = args;
        const {userCLT, memeCLT} = ctx;

        //Check if the user exists and is an admin
        const user = await userCLT.findOne({_id: ObjectID(adminID), token: adminToken, admin: true});
        if (!user)
            return {msgInfo: `ERROR - Invalid email/token for Admin.`};

        //Search for the meme
        const meme = await memeCLT.findOneAndDelete({_id: ObjectID(memeID)});
        if(!meme.value)
            return {msgInfo: `ERROR - Meme not found.`};

        //Return Memes
        return {
            msgInfo: `SUCCESS`,
            meme: [meme.value]
        };
    },
    //############################# END REMOVE #############################
}

export default Mutation;