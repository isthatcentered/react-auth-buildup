import express, { ErrorRequestHandler } from "express"
import bodyParser from "body-parser"
import { usersRouter } from "./Routes/users"
import { authRouter } from "./Routes/sessions"
import session from "express-session"
import env from "dotenv"
import { quotesRouter } from "./Routes/quotes"
import { uncover } from "redhanded"
import { ApiError } from "./contracts"
import expressJwt from "express-jwt"
import { makeCsrfToken } from "./middlewares"
import csrf from "csurf"
import cookieParser from "cookie-parser"
// https://github.com/BrianDGLS/express-ts

env.config()

const PORT = process.env.port || 4001
const app: express.Application = express()

app.use(cookieParser())
app.use( csrf( { cookie: true } ) )
app.use( makeCsrfToken )

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
app.use( "/api/session", authRouter )

// Protected routes
app.use( expressJwt( { secret: process.env.JWT_SECRET! } ) )
app.use( "/api/quotes", quotesRouter )


// custom error handler
const logErrorHandler: ErrorRequestHandler    = ( err: Error | ApiError, req, res, next ) => {
	      uncover( err.name )( err.message )
	
	      next( err )
      },
      globalErrorHandler: ErrorRequestHandler = ( err: Error | ApiError, req, res, next ) => {
	
	      if ( !isCustomError() )
		      return next( err )
	
	
	      return res.status( (err as any).status )
		      .send( err )
	
	
	
	      function isCustomError(): boolean
	      {
		      return !!(err as any).status // @todo: fix with type guard
	      }
      }

app.use( logErrorHandler, globalErrorHandler )