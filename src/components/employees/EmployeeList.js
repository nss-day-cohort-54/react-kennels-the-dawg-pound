import React, { useState, useEffect } from "react"
import Employee from "./Employee"
import EmployeeRepository from "../../repositories/EmployeeRepository"
import "./EmployeeList.css"


export default () => {
    const [emps, setEmployees] = useState([])

    useEffect(
        () => {
            EmployeeRepository.getAll()
            // write .then()
            .then((data) => {
                setEmployees(data)})
        }, []
    )

    const employeeOnly = emps.filter(emp => emp.employee === true)

    return (
        <>
            <div className="employees">
                {
                    employeeOnly.map(employee => <Employee key={employee.id} employee={employee} setEmployees={setEmployees} employees={employeeOnly}/>)
                }
            </div>
        </>
    )
}
