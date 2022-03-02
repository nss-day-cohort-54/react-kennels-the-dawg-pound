import React, { useState, useEffect } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import person from "./person.png"
import "./Employee.css"
import LocationRepository from "../../repositories/LocationRepository";


export default ({ employee, setEmployees, employees }) => {
    const [animalCount, setCount] = useState(0)
    const [location, markLocation] = useState({ name: "" })
    const [classes, defineClasses] = useState("card employee")
    const [locations, defineLocations] = useState([])
    const [users, changeUser] = useState([])
    const history = useHistory()
    const { employeeId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource: currentEmployee } = useResourceResolver()

    useEffect(() => {
        if (employeeId) {
            defineClasses("card employee--single")
            resolveResource(employee, employeeId, EmployeeRepository.get)
                .then(() => LocationRepository.getAll())
                .then(locations => defineLocations(locations))
        } else {
            resolveResource(employee, employeeId, EmployeeRepository.get)
        }
    }, [])

    useEffect(() => {
        if (currentEmployee?.employeeLocations?.length > 0) {
            markLocation(currentEmployee.locations[0].location)
        }
    }, [currentEmployee])
    const currentUser = getCurrentUser()

    useEffect(() => {
        if (currentEmployee?.animals?.length > 0) {
            setCount(currentEmployee.animals.length)
        }
    }, [currentEmployee])

    const handleUserInput = (event) => {
        const copy = {...currentEmployee}
        copy[event.target.id] = event.target.value
        //updateEmployee(copy)
    }

    return (
        <article className={classes}>
            <section className="card-body">
                <img alt="Kennel employee icon" src={person} className="icon--person" />
                <h5 className="card-title">
                    {
                        employeeId
                            ? currentEmployee.name
                            : <Link className="card-link"
                                to={{
                                    pathname: `/employees/${currentEmployee.id}`,
                                    state: { employee: currentEmployee }
                                }}>
                                {currentEmployee.name}
                            </Link>

                    }
                </h5>
                {
                    employeeId
                        ? <>
                            <section>
                                Caring for {animalCount} animals
                            </section>
                            <section>
                                Working at {location.name} location
                            </section>
                            <section>
                                <form className="employeeForm">
                                    {location.name
                                        ? <label htmlFor="location">Reassign to location</label>
                                        : <label htmlFor="location">Assign to location</label>
                                    }
                                    <select onChange={handleUserInput}
                                        defaultValue=""
                                        name="location"
                                        id="location"
                                        className="form-control"
                                    >
                                        <option value="0">Select a location</option>
                                        {locations.map(location => (
                                            <option key={location.id} value={location.id}>
                                                {location.name}
                                            </option>
                                        ))}
                                    </select>
                                </form>
                            </section>
                        </>
                        : ""
                }

                {/* write onCLick event */}
                {currentUser.employee ? <button className="btn--fireEmployee" id={currentEmployee.id} onClick={(event) => {
                    if (currentUser.id === parseInt(event.target.id)) {
                        window.alert("You cannot fire yourself. Please see management for assistance")

                    } else {

                        EmployeeRepository.delete(currentEmployee.id)
                            .then(() => {

                                if (employeeId) {
                                    history.push("/employees")
                                } else {
                                    const copy = employees.filter(employee => {
                                        return employee.id != currentEmployee.id
                                    })
                                    setEmployees(copy)
                                }
                            })
                    }

                }}>Fire</button> : ""}

            </section>

        </article>
    )
}
