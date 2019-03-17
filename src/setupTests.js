import * as td from "testdouble" // https://github.com/testdouble/testdouble.js
import { cleanup } from "react-testing-library" // https://testing-library.com/docs/
import "jest-dom/extend-expect" // https://www.npmjs.com/package/jest-dom
import testDoubleAdapter from "testdouble-jest" // https://github.com/testdouble/testdouble-jest

testDoubleAdapter( td, jest )


afterEach( () => {
	cleanup() // react-testing-library-setup (will have to check performance impact without it as global)
	td.reset()
} )



export default undefined // otherwise ts will throw "Cannot compile namespaces when the '--isolatedModules' flag is provided." See note in https://facebook.github.io/create-react-app/docs/running-tests