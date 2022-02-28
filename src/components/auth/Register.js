import React, { useState } from "react"
import { useHistory } from "react-router-dom";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth"
import "./Login.css"

export const Register = () => {
    const [credentials, syncAuth] = useState({
        firstName: "",
        lastName: "",
        email: "",
        employee: false
    })
    const { register } = useSimpleAuth()
    const history = useHistory()

    const handleRegister = (e) => {
        e.preventDefault()

        const newUser = {
            name: `${credentials.firstName} ${credentials.lastName}`,
            email: credentials.email,
            employee: credentials.employee
        }
        // register() takes a user object as argument
        // returns a fetch().then() chain of promises
        // POSTs user object to database/users 
        // base64 encodes the userObject and saves to localSotrage as the kennel_token
        // is this the desired functionality? shouldn't only logging in set the kennel_token?
        register(newUser).then(() => {
            history.push("/")
        })
    }

    const handleUserInput = (event) => {
        // adds the inputs to the state
        const copy = {...credentials}
        // credentials/copy should have properties firstName, lastName, email, and employee
        copy[event.target.id] = event.target.value
        syncAuth(copy)
    }


    return (
        <main style={{ textAlign: "center" }}>
            <form className="form--login" onSubmit={handleRegister}>
                <h1 className="h3 mb-3 font-weight-normal">Please Register for NSS Kennels</h1>
                <fieldset>
                    <label htmlFor="firstName"> First Name </label>
                    <input type="text" onChange={handleUserInput}
                        id="firstName"
                        className="form-control"
                        placeholder="First name"
                        required autoFocus />
                </fieldset>
                <fieldset>
                    <label htmlFor="lastName"> Last Name </label>
                    <input type="text" onChange={handleUserInput}
                        id="lastName"
                        className="form-control"
                        placeholder="Last name"
                        required />
                </fieldset>
                <fieldset>
                    <label htmlFor="inputEmail"> Email address </label>
                    <input type="email" onChange={handleUserInput}
                        id="email"
                        className="form-control"
                        placeholder="Email address"
                        required />
                </fieldset>
                <fieldset>
                    <input
                        onChange={
                            (event) => {
                                const copy = { ...credentials }
                                if (event.target.value === "on") {
                                    copy.employee = true
                                }
                                else {
                                    copy.employee = false
                                }
                                syncAuth(copy)
                            }
                        }
                        defaultChecked={credentials.employee}
                        type="checkbox" name="employee" id="employee" />
                    <label htmlFor="employee"> Employee account? </label>
                </fieldset>

                <fieldset>
                    <button type="submit">
                        Sign in
                    </button>
                </fieldset>
            </form>
        </main>
    )
}
