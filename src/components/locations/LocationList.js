import React, { useEffect, useState } from "react"
import LocationRepository from "../../repositories/LocationRepository";
//function to create location cards
import Location from "./Location"
import "./LocationList.css"


//exports location list
export const LocationList = () => {
    //creates state variable for locations
    const [ locations, updateLocations ] = useState([])
    

    useEffect(
        () => {
            LocationRepository.getAll()
            // getAll() gets locations embed=animals embed=employeeLocations
            .then((data) => {
                updateLocations(data)})
        }, []
    )



    return (
        <div className="locations">
            {locations.map(l => <Location key={l.id} location={l} />)}
        </div>
    )
}
