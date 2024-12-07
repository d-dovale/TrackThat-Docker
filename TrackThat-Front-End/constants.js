const base = import.meta.env.VITE_URL || "127.0.0.1";

console.log("Constants: ===========", base)

export const SIGNUPURL = `http://${base}:8000/auth/signup`
export const LOGINURL = `http://${base}:8000/auth/login-email`
export const SETGOALURL = `http://${base}:8000/auth/set-goal`
export const PATCHUSERURL = `http://${base}:8000/auth/patch-user`
export const APPLICATIONSURL = `http://${base}:8000/applications`
