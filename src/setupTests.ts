import * as td from "testdouble" // https://github.com/testdouble/testdouble.js
import { cleanup } from "react-testing-library" // https://testing-library.com/docs/
import "jest-dom/extend-expect" // https://www.npmjs.com/package/jest-dom
// @ts-ignore
import testDoubleAdapter from "testdouble-jest" // https://github.com/testdouble/testdouble-jest

testDoubleAdapter( td, jest )


afterEach( () => {
	cleanup() // react-testing-library-setup (will have to check performance impact without it as global)
	td.reset()
} )

declare global
{
	interface Array<T>
{
	last(): T | undefined
	
	first(): T | undefined
	
	hasDuplicates: () => boolean
}
}

declare namespace jest
{
	interface MockInstance<T, Y extends any[]>
{
	whatever: string
}
}

Object.defineProperties( Array.prototype, {
	hasDuplicates: {
		value: function () {
			
			const withoutDuplicates = new Set( this )
			
			return withoutDuplicates.size !== this.length
		},
	},
	last:          {
		value: function () {
			return this[ this.length - 1 ]
		},
	},
	first:         {
		value: function () {
			return this[ 0 ]
		},
	},
} )



export default undefined // otherwise ts will throw "Cannot compile namespaces when the '--isolatedModules' flag is provided." See note in https://facebook.github.io/create-react-app/docs/running-tests