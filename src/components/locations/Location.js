import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import locationImage from "./location.png"
import "./Location.css"
import LocationRepository from "../../repositories/LocationRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";

//creates jsx of location cards
export default ({location}) => {
    const [classes, defineClasses] = useState("card location")
    const [animalCount, updateAnimalCount] = useState(0)
    const [employeeCount, updateEmployeeCount] = useState(0)
    const { locationId } = useParams()
    const { resolveResource, resource } = useResourceResolver()


    useEffect(() => {
        if (locationId) {
            defineClasses("card location--single")
        }
        resolveResource(location, locationId, LocationRepository.get)
    }, [])

    useEffect(() => {
        if (resource?.animals?.length > 0) {
            updateAnimalCount(resource.animals.length)
        }
    }, [resource])

    useEffect(() => {
        if (resource?.employeeLocations?.length > 0) {
            updateEmployeeCount(resource.employeeLocations.length)
        }
    }, [resource])

    return (
        <article className={classes} style={{ width: `18rem` }}>
            <section className="card-body">
                <img alt="Kennel location icon" src={locationImage} className="icon--location" />
                <h5 className="card-title">
                    {
                        locationId
                            ? resource.name
                            : <>
                            <Link className="card-link"
                                to={{
                                    pathname: `/locations/${resource.id}`,
                                    state: { location: resource }
                                }}>
                                {resource.name}
                            </Link>
                            <section>
                                Total Animal: {animalCount}
                            </section>
                            <section>
                                Total Employee: {employeeCount}
                            </section>
                        </>
                    }
                </h5>
            </section>
            
        </article>
    )
}
