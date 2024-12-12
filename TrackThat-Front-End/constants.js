const base = import.meta.env.VITE_URL || "http://127.0.0.1:8000";

export const BASEURL = base
export const SIGNUPURL = `${base}/auth/signup`
export const LOGINURL = `${base}/auth/login-email`
export const SETGOALURL = `${base}/auth/set-goal`
export const PATCHUSERURL = `${base}/auth/patch-user`
export const APPLICATIONSURL = `${base}/applications`
