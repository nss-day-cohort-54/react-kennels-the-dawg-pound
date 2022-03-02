import Settings from "./Settings"
import { fetchIt } from "./Fetch"
import LocationRepository from "./LocationRepository"
import AnimalRepository from "./AnimalRepository"

// function to expand the location and animal information for a user
// locations should be a array of all locations
// animals should be an array of all animals
const createUser = (user, locations, animals) => {
    user.locations = user.employeeLocations.map(employeeLocation => {
        employeeLocation.location = locations.find(location => location.id === employeeLocation.locationId)
        return employeeLocation
    })
    
    user.animals = user.animalCaretakers.map(animalCaretaker => {
        animalCaretaker.animal = animals.find(animal => animal.id === animalCaretaker.animalId)
        return animalCaretaker
    })
    return user
}


export default {
    async get(id) {
        const locations = await LocationRepository.getAll()
        const animals = await AnimalRepository.getAll()
        return await fetchIt(`${Settings.remoteURL}/users/${id}?_embed=employeeLocations&_embed=animalCaretakers`)
            .then(user => {
                user = createUser({...user}, locations, animals)
                return user
            })
    },
    async delete(id) {
        
        return await fetchIt(`${Settings.remoteURL}/users/${id}`, "DELETE")
            .then(() => {
                //get caretakers
                const careTakers = fetchIt(`${Settings.remoteURL}/animalCaretakers`)
                return careTakers
            })
            .then((careTakers) => {
                //match id against caretakers.userId
                const matchedCareTakers = careTakers.filter(careTaker => careTaker.userId === id)
                //delete matching caretaker objects
                for (const careTaker of matchedCareTakers) {
                    fetchIt(`${Settings.remoteURL}/animalCaretakers/${careTaker.id}`, "DELETE")
                }
            })
            .then(() => {
                //get employeeLocations
                const employeeLocations = fetchIt(`${Settings.remoteURL}/employeeLocations`)
                return employeeLocations
            })
            .then((employeeLocations) => {
                //match id against employeeLocations
                const matchedEmployeeLocations = employeeLocations.filter(employeeLocation => employeeLocation.userId === id)
                //delete matching employeeLocations
                for (const employeeLocation of matchedEmployeeLocations) {
                    fetchIt(`${Settings.remoteURL}/employeeLocations/${employeeLocation.id}`, "DELETE")
                }

            })

    },
    async addEmployee(employee) {
        return await fetchIt(`${Settings.remoteURL}/users`, "POST", JSON.stringify(employee))
    },
    async assignEmployee(rel) {
        return await fetchIt(`${Settings.remoteURL}/employeeLocations`, "POST", JSON.stringify(rel))
    },
    async getAll() {
        const locations = await LocationRepository.getAll()
        const animals = await AnimalRepository.getAll()
        return await fetchIt(`${Settings.remoteURL}/users?employee=true&_embed=employeeLocations&_embed=animalCaretakers`)
            .then(users => {
                return users.map(user => {
                    user = createUser({...user}, locations, animals)
                    
                    return user
                })
            })
    }
}
