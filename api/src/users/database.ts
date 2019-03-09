/*
 * DOCS: https://www.npmjs.com/package/lowdb#how-to-query
 */



const low = require( "lowdb" )
const FileSync = require( "lowdb/adapters/FileSync" )

const adapter = new FileSync( "db.json" )
export const db = low( adapter )


db.defaults( { users: [] } )
	.write()
