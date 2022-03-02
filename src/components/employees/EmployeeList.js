import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import Employee from "./Employee"
import EmployeeRepository from "../../repositories/EmployeeRepository"
import "./EmployeeList.css"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth"


export default () => {
    const [emps, setEmployees] = useState([])
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()

    useEffect(
        () => {
            EmployeeRepository.getAll()
            // write .then()
            .then((data) => {
                setEmployees(data)})
        }, []
    )

    return (
        <>            
        {   // getCurrentUser checks the user token
            // employee is a boolean value
            getCurrentUser().employee
                // if true return empty string
                ? <div className="centerChildren btn--newResource">
                    <button type="button"
                        className="btn btn-success "
                        onClick={() => { history.push("/employees/create") }}>
                        Register Employee
                    </button>
                </div>
                // if false return new employee button
                : ""
        }
            <div className="employees">
                {
                    emps.map(employee => <Employee key={employee.id} employee={employee} setEmployees={setEmployees} employees={emps}/>)
                }
            </div>
        </>
    )
}
