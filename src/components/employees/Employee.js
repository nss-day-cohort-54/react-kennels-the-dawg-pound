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
    const [reassignedEmployee, updateEmployee] = useState({})
    const [updatedLocation, newLocation] = useState({})
    const [classes, defineClasses] = useState("card employee")
    //const [employeeLocations, setEmployeeLocations] = useState([])
    const [locations, defineLocations] = useState([])
    const [users, changeUser] = useState([])
    const history = useHistory()
    const { employeeId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource: currentEmployee } = useResourceResolver()
    const currentUser = getCurrentUser()
    useEffect(() => {
        if (employeeId) {
            defineClasses("card employee--single")
            LocationRepository.getAll()
                .then(locations => defineLocations(locations))
                .then(() => resolveResource(employee, employeeId, EmployeeRepository.get))
        } else {
            resolveResource(employee, employeeId, EmployeeRepository.get)
        }
    }, [reassignedEmployee])

    useEffect(() => {
        if (currentEmployee?.employeeLocations?.length > 0) {
            markLocation(currentEmployee.locations[0].location)
        }
        if (currentEmployee?.animals?.length > 0) {
            setCount(currentEmployee.animals.length)
        }
    }, [currentEmployee])
    


    const handleUserInput = (event) => {
        const loc =  parseInt(event.target.value)
        newLocation(loc)
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
                                <button type="submit"
                                    onClick={
                                        evt => {
                                            evt.preventDefault()
                                            if (!getCurrentUser().employee) {
                                                window.alert("Only employees may reassign employees")
                                            } else {
                                                EmployeeRepository.reassignEmployee(currentEmployee, updatedLocation)
                                                    .then(updateEmployee)
                                            }
                                        }
                                    }
                                    className="btn btn-primary"> Reassign Employee </button>
                                {/* write onClick event */}
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

    </article >
)
}
