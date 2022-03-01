import Settings from "./Settings"
import { fetchIt } from "./Fetch"
import LocationRepository from "./LocationRepository"
import AnimalRepository from "./AnimalRepository"

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
                debugger
                return user
            })
    },
    async delete(id) {
        return await fetchIt(`${Settings.remoteURL}/users/${id}`, "DELETE")
       
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
        return await fetchIt(`${Settings.remoteURL}/users?_embed=employeeLocations&_embed=animalCaretakers`)
            .then(users => {
                return users.map(user => {
                    user = createUser({...user}, locations, animals)
                    
                    return user
                })
            })
    }
}
