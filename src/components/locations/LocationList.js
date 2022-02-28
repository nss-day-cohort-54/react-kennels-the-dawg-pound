import React, { useEffect, useState } from "react"
import LocationRepository from "../../repositories/LocationRepository";
//function to create location cards
import Location from "./Location"
import "./LocationList.css"

//exports location list
export const LocationList = () => {
    //creates state variable for locations
    const [ locations, updateLocations ] = useState([])
    //not sure what getAll does
    //dont think this is setting locations array in state
    useEffect(() => {
        LocationRepository.getAll()
    }, [])
    //returns jsx of location cards using Locations function
    return (
        <div className="locations">
            {locations.map(l => <Location key={l.id} location={l} />)}
        </div>
    )
}
