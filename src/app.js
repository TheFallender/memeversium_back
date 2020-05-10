//Libraries
import {MongoClient} from 'mongodb';
import 'babel-polyfill';

//Resolvers
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Meme from './resolvers/Meme'

//TypeDefs
import typeDefs from './schema';



//ApolloServer
	const {ApolloServer} = require('apollo-server');



//MongoDB
	//User info
	const usr = "runAsAdmin";
	const pwd = "Txg6FuaFA8g%5EN53Fxp";
	const url = "thefallencluster-7uuhn.gcp.mongodb.net/test?authSource=admin&replicaSet=TheFallenCluster-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

//Connect to MongoDB
const connectToDb = async function(usr, pwd, url) {
	const uri = `mongodb+srv://${usr}:${pwd}@${url}`;
	const client = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	await client.connect();
	return client;
};



//Apollo Server
const runApolloServer = function(context) {
	//GraphQL
		//Resolvers
		const resolvers = {
			Query,
			Mutation,
			Meme,
		}

	//Apollo Server
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context,
	});

	//Listen on URL
	try {
		server.listen({ port: process.env.PORT || 4000 }).then(({url}) => {
			console.log(`Server ready at ${url} and on port ${process.env.PORT || 4000}`);
		});
	} catch (e) {
		console.info(e);
		server.close();
	}
}



//Run the App
const runApp = async function() {
	const client = await connectToDb(usr, pwd, url);
	console.log("Connecting to Mongo DB...");
	try {
		runApolloServer({
			client,
			db: client.db("memeversium"),
			userCLT: client.db("memeversium").collection("users"),
			memeCLT: client.db("memeversium").collection("memes")
		});
	} catch (e) {
		console.log(e)
		client.close();
	}
};

//Execute the app
runApp();