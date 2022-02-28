import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import person from "./person.png"
import "./Employee.css"


export default ({ employee }) => {
    const [animalCount, setCount] = useState(0)
    const [location, markLocation] = useState({ name: "" })
    const [classes, defineClasses] = useState("card employee")
    const [ users, changeUser]
    const { employeeId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource } = useResourceResolver()

    useEffect(() => {
        if (employeeId) {
            defineClasses("card employee--single")
        }
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [])
    
    useEffect(() => {
        if (resource?.employeeLocations?.length > 0) {
            markLocation(resource.employeeLocations[0])
        }
    }, [resource])
    const currentUser = getCurrentUser()

    const fireEmployee = (id) => {
        fetch(`http://localhost:8088/serviceEmployees/${id}`, {
            method: "DELETE"
        })
        //makes a copy of tickets with id's that do NOT 
        //equal the id being passed through the function
        const copy = users.filter(user => {
            return user.id != id
        })
        changeUser(copy)
    }



    

    return (
        <article className={classes}>
            <section className="card-body">
                <img alt="Kennel employee icon" src={person} className="icon--person" />
                <h5 className="card-title">
                    {
                        employeeId
                            ? resource.name
                            : <Link className="card-link"
                                to={{
                                    pathname: `/employees/${resource.id}`,
                                    state: { employee: resource }
                                }}>
                                {resource.name}
                            </Link>

                    }
                </h5>
                {
                    employeeId
                        ? <>
                            <section>
                                Caring for 0 animals
                            </section>
                            <section>
                                Working at unknown location
                            </section>
                        </>
                        : ""
                }
                
                {/* write onCLick event */}
                {currentUser.employee ? <button className="btn--fireEmployee" onClick={() => {
                    fireEmployee(user.id)
                }}>Fire</button> : "" }

            </section>

        </article>
    )
}
