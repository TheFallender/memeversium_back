import 'babel-polyfill';
import {MongoClient, ObjectID} from 'mongodb';

const Meme = {
    //User
    user: async (parent, args, ctx, info) => {
        //Ctx
        const {userCLT} = ctx;
        const userID = parent.user;

        //Search the user
        const user = await userCLT.findOne({_id: ObjectID(userID)});
        
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