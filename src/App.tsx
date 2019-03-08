import React, { Component } from "react";
import "./App.css";
import { Header } from "./Header"
import { Router } from "@reach/router"
import { AuthProvider } from "./AuthContext"
import { LoginPage } from "./LoginPage"
import { HomePage } from "./HomePage"




class App extends Component
{
	
	render()
	{
		return (
			<AuthProvider>
				<div className="App">
					<Header/>
					
					<main className="p-4">
						<Router>
							<HomePage
								path="/"
							/>
							<LoginPage
								path="/login"
							/>
						</Router>
					</main>
				</div>
			</AuthProvider>
		);
		
	}
}

export default App;



