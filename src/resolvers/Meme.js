import 'babel-polyfill';
import {MongoClient, ObjectID} from 'mongodb';

const Meme = {
    //User
    user: async (parent, args, ctx, info) => {
        //Ctx
        const {userCLT} = ctx;
        const userID = parent.user;

        //Search the user
        let user = null;
        //Check ID is not empty
        if (userID !== "")
            user = await userCLT.findOne({_id: ObjectID(userID)});
        else
            //Return removed
            return {
                _id: "INVALID_ID_USER_HAS_BEEN_REMOVED",
                user: "<user removed>",
                admin: false,
                blocked: true,
            }

            
        //Check that the user is valid 
        if (!user)
            return {
                _id: "INVALID_ID_USER_HAS_BEEN_REMOVED",
                user: "<user removed>",
                admin: false,
                blocked: true,
            }
        
        //User return
        return {
            _id: user._id,
            user: user.user,
            admin: user.admin,
            blocked: user.blocked,
        };
    },
}

export default Meme;