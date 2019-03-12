import Axios from "axios"




Axios.defaults.xsrfCookieName = "csrf-token"
Axios.defaults.xsrfHeaderName = "csrf-token"


export const API = Axios.create( {
	baseURL:         "/api/",
	withCredentials: true,
} )

