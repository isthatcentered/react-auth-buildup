import { NextFunction } from "express-serve-static-core"




declare namespace Express
{
	interface Request
	{
	}
	
	interface Session
	{
	}
}


interface Array<T>
{
	// last(): T | undefined
}