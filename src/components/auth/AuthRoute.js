import React from "react"
import { Route, Redirect } from "react-router-dom"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth"

const AuthRoute = ({ path, component: TargetComponent }) => {
    // useSimpleAuth returns { isAuthenticated, logout, login, register, getCurrentUser }
    // isAuthenticated should be a boolean
    // potential error - is this variable initialized properly to obtain isAuthenticated?
    const { isAuthenticated } = useSimpleAuth()

    return (
        <Route exact path={path} render={props => {
            // if user is authenticated route to TargetComponent with props?
            if (isAuthenticated()) {
                return <TargetComponent {...props} />
            } else {
                // else route to login page
                return <Redirect to="/login" />
            }
        }} />
    )
}
// exports AuthRoute, but never imported anywhere?
export default AuthRoute
