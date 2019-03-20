const { compilerOptions } = require( "./tsconfig" )


module.exports = {
	preset: "ts-jest",
	setupFilesAfterEnv: [ "<rootDir>/src/setupTests.ts" ],
	testEnvironment: "jsdom",
	globals: {
		"ts-jest": {
			tsConfig: {
				...compilerOptions,
				jsx: "react",
			},
		},
	},
}
