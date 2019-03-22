import React from "react";

import { storiesOf } from "@storybook/react";
//@ts-ignore
import { action } from "@storybook/addon-actions";
//@ts-ignore
import { linkTo } from "@storybook/addon-links";



/*
storiesOf( "Welcome", module ).add( "to Storybook", () => <Welcome showApp={linkTo( "Button" )}/> );

storiesOf( "Button", module )
	.add( "with text", () => <Button onClick={action( "clicked" )}>Hello Button</Button> )
	.add( "with some emoji", () => (
		<Button onClick={action( "clicked" )}>
      <span role="img"
            aria-label="so cool">
        😀 😎 👍 💯
      </span>
		</Button>
	) );
*/


storiesOf( "AuthenticationPage", module )
	.add( "Logging in", () => {
		return <div>Hello 🥳</div>
	} )