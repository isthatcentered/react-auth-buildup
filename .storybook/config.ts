import { addParameters, configure } from "@storybook/react"

import { create, themes } from "@storybook/theming";



// automatically import all files ending in *.stories.tsx
const req = require.context( "../src/stories", true, /.stories.tsx$/ )


addParameters( {
	options: {
		name:  "Foo",
		theme: create( {
			base:         "light",
			// appBg:        "white",
			appContentBg: "#f1f5f8",
		} ),
	},
} );

configure( () => req.keys().forEach( req ), module )

/*
import { configure } from "@storybook/react"

function loadStories()
{
	require( "../src/stories" )
}

configure( loadStories, module )
 */