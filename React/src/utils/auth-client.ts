import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
 
const authClient =  createAuthClient({
    baseURL: process.env.REACT_APP_API_URL
})

export default authClient ;
