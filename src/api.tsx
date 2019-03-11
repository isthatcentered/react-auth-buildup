import Axios from "axios"




export const API = Axios.create( {
	baseURL:         "/api/",
	withCredentials: true,
} )


