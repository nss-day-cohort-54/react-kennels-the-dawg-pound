import React, { useState } from "react"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import { Link, useHistory } from "react-router-dom";
import "./Login.css"


const Login = () => {
    // starts credentials state with blank emai and remember false
    const [credentials, syncAuth] = useState({
        email: "",
        remember: false
    })
    // useSimpleAuth returns
    // { isAuthenticated, logout, login, register, getCurrentUser }
    const { login } = useSimpleAuth()
    const history = useHistory()

    // Simplistic handler for login submit
    // invoked when user clicks submit button on login form
    // takes the click event as a parameter
    const handleLogin = (e) => {
        e.preventDefault()
        // credentials.remember is a boolean
        // if true pulls from localStorage, false pulls from sessionStorage
        // sessionStorage is persistent only within a single tab or window
        // localStorage is persisten for the browser
        const storage = credentials.remember ? localStorage : sessionStorage

        /*
            For now, just store the email and userName that
            the customer enters into local storage.
        */
        console.log("*** Initiate authentication ***")
        // login() is from useSimpleAuth
        // potential error - login takes one parameter, email, in func def
        // login() fetches the user from the api, base64 encodes the object
        // and stores the encoding as the kennel_token in localStorage
        // returns a boolean checking whether user exists in database
        login(credentials.email, credentials.userName, storage)
            .then(success => {
                if (success) {
                    console.log("*** Rerouting to root URL ***")
                    history.push("/")
                }
            })
    }

    const handleUserInput = (event) => {
        const copy = {...credentials}
        copy[event.target.id] = event.target.value
        // syncAuth() is the state setting function for credentials
        syncAuth(copy)
    }

    return (
        <main className="container--login">
            <section>
                <form className="form--login" onSubmit={handleLogin}>
                    <h1>Nashville Kennels</h1>
                    <h2 className="h3 mb-3 font-weight-normal">Please sign in</h2>
                    <fieldset>
                        <label htmlFor="inputEmail"> Email address </label>
                        {/* this input handles saving the email input to state */}
                        <input type="email" onChange={handleUserInput}
                            id="email"
                            className="form-control"
                            placeholder="Email address"
                            required autoFocus />
                    </fieldset>
                    <fieldset>
                        {/* this input sets wether localStorage or sessionStorage is used */}
                        <input
                            onChange={
                                (event) => {
                                    const copy = {...credentials}
                                    if (event.target.value === "on") {
                                        copy.remember = true
                                    }
                                    else {
                                        copy.remember = false
                                    }
                                    syncAuth(copy)
                                }
                            }
                            defaultChecked={credentials.remember}
                            type="checkbox" name="remember" id="remember" />
                        <label htmlFor="remember"> Remember Me </label>
                    </fieldset>
                    <fieldset>
                        <button type="submit">
                            Sign in
                    </button>
                    </fieldset>
                </form>
            </section>
            <section className="link--register">
                <Link to="/register">Not a member yet?</Link>
            </section>
        </main>
    )
}
export default Login
