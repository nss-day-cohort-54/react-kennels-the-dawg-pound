import React, { useState } from "react"
import { Link, useHistory } from "react-router-dom"
import AnimalRepository from "../../repositories/AnimalRepository";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import Settings from "../../repositories/Settings";
import LocationRepository from "../../repositories/LocationRepository";
import "bootstrap/dist/css/bootstrap.min.css"
import "./NavBar.css"


//exports search bar
export const NavBar = () => {
    //creates searchTerms to save search field as state
    const [ searchTerms, setTerms ] = useState("")

    const { isAuthenticated, logout, getCurrentUser } = useSimpleAuth()
    //when function happens, redirects to url with /search
    //useHistory is a statehook
    const history = useHistory()
    //function that searches using e as a parameter
    //e = event?
    const search = (e) => {
        //if "enter" is pressed
        if (e.keyCode === 13) {
            //gets terms from document
            const terms = document.querySelector("#searchTerms").value
            //creates foundItems object with empty arrays
            const foundItems = {
                animals: [],
                locations: [],
                employees: [],
                isEmployee: false
            }
            
            fetch(`${Settings.remoteURL}/users?employee=true&name_like=${encodeURI(terms)}`)
                .then(r => r.json())
                .then(employees => {
                    //sets foundItems.employees as employees
                    foundItems.employees = employees
                    //return locations
                    return LocationRepository.search(terms)
                })
                .then(locations => {
                    foundItems.locations = locations
                    return AnimalRepository.getAll()
                })
                .then(animals => {
                    foundItems.animals = animals.filter(anml => anml.name.includes(terms))
                    let copy = {...foundItems}
                    copy.isEmployee = getCurrentUser().employee
                    setTerms("")
                    history.push({
                        pathname: "/search",
                        state: copy
                    })
                })
        }
        //sets searchbar field as searchTerms
        else {
            setTerms(e.target.value)
        }
    }

    return (
        <div className="container">
            <nav className="navbar navbar-expand-sm navbar-light bg-light fixed-top onTop">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div id="navbarNavDropdown" className="navbar-collapse collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/">NSS Kennels <span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/locations">Locations</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/animals">Animals</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/employees">Employees</Link>
                        </li>
                        <li className="nav-item">
                            <input id="searchTerms"
                                onKeyUp={search}
                                className="form-control w-100"
                                type="search"
                                placeholder="Search"
                                aria-label="Search" />
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            {
                                isAuthenticated()
                                    ? <Link onClick={() => {
                                        logout()
                                    }} className="nav-link" to="/login">Logout {getCurrentUser().name}</Link>
                                    : <Link className="nav-link" to="/login">Login</Link>
                            }
                        </li>
                        <li className="nav-item">
                            {
                                !isAuthenticated()
                                    ? <Link className="nav-link" to="/register">Register</Link>
                                    : ""
                            }
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}
