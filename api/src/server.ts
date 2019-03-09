import express from "express"
import bodyParser from "body-parser"
import { usersRouter } from "./Routes/usersRoutes"
import { authRouter } from "./Routes/authRoutes"

// https://github.com/BrianDGLS/express-ts


const PORT = process.env.port || 4001
const app: express.Application = express()

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );


app.get( "/", function ( req, res ) {
	res.send( "Hello World!" );
} );

app.listen( PORT, function () {
	console.log( `App listening on port ${PORT}!` );
} );



app.use( "/api/users", usersRouter )
app.use( "/api/authenticate", authRouter )
