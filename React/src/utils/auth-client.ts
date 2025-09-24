import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
import { runtimeEnv } from './runtime-env';

const authClient =  createAuthClient({
    baseURL: runtimeEnv.apiUrl(),
})

export default authClient ;
