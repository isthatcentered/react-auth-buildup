import express from "express"
import bodyParser from "body-parser"
import { usersRouter } from "./Routes/usersRoutes"
import { authRouter } from "./Routes/authRoutes"
import session from "express-session"
import env from "dotenv"
// https://github.com/BrianDGLS/express-ts

env.config()

const PORT = process.env.port || 4001
const app: express.Application = express()

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );

app.use(
	session( {
		secret:            process.env.SESSION_SECRET!,
		resave:            false,
		saveUninitialized: false,
		cookie:            { secure: false, httpOnly: true, maxAge: 3600000 },
	} ),
);

app.get( "/", function ( req, res ) {
	res.send( "Hello World!" );
} );

app.listen( PORT, function () {
	console.log( `App listening on port ${PORT}!` );
} );



app.use( "/api/users", usersRouter )
app.use( "/api/authenticate", authRouter )
