import Settings from "./Settings"
import { fetchIt } from "./Fetch"



export default {
    async get(id) {
        const userLocations = await fetchIt(`${Settings.remoteURL}/employeeLocations?userId=${id}&_expand=location&_expand=user`)
        return await fetchIt(`${Settings.remoteURL}/animalCaretakers?userId=${id}&_expand=animal`)
            .then(data => {
                const userWithRelationships = userLocations[0].user
                userWithRelationships.locations = userLocations
                userWithRelationships.animals = data
                return userWithRelationships
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
        return await fetchIt(`${Settings.remoteURL}/users?employee=true&_embed=employeeLocations`)
    }
}
