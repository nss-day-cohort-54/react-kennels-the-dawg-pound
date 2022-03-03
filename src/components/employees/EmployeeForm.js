import React, { useEffect, useState } from "react"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import { useHistory } from "react-router-dom"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import "./EmployeeForm.css"
import LocationRepository from "../../repositories/LocationRepository";


export default (props) => {
    const [newEmployee, updateEmployee] = useState({name: "", location: 0})
    const [locations, defineLocations] = useState([])
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()

    // write useEffect() (s)
    useEffect(
        () => {
            LocationRepository.getAll()
                .then(locations => defineLocations(locations))
        }
    , [])

    const constructNewEmployee = () => {
        if (newEmployee.name.length === 0) {
            window.alert("Please enter employee name.")
        } else if (parseInt(newEmployee.location) === 0) {
            window.alert("Please select a location.")
        }  else {
            EmployeeRepository.addEmployee({
                name: newEmployee.name,
                employee: true
            })
            .then(employee => {
                EmployeeRepository.assignEmployee({
                    userId: employee.id,
                    locationId: parseInt(newEmployee.location)
                })
            })
            .then(() => history.push("/employees"))
            
        }
    }

    // update employee to transient state after add new employee or assign a location
    const handleUserInput = (event) => {
        const copy = {...newEmployee}
        copy[event.target.id] = event.target.value
        updateEmployee(copy)
    }

    return (
        <>
            <form className="employeeForm">
                <h2 className="employeeForm__title">New Employee</h2>
                <div className="form-group">
                    <label htmlFor="employeeName">Employee name</label>
                    <input onChange={handleUserInput}
                        type="text"
                        name="employeeName"
                        id="name"
                        required
                        autoFocus
                        className="form-control"
                        placeholder="Employee name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Assign to location</label>
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
                </div>
                <button type="submit"
                    onClick={
                        evt => {
                            evt.preventDefault()
                            if (!getCurrentUser().employee) {
                                window.alert("Only employees may add employees")
                            } else {
                                constructNewEmployee()
                            }
                        }
                    }
                    className="btn btn-primary"> Save Employee </button>
                    {/* write onClick event */}
            </form>
        </>
    )
}
