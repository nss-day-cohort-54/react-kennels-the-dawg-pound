import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router";
import AnimalRepository from "../../repositories/AnimalRepository";
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository";
import OwnerRepository from "../../repositories/OwnerRepository";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import Settings from "../../repositories/Settings";
import "./AnimalCard.css"
import { fetchIt } from "../../repositories/Fetch";


export const Animal = ({ animal, syncAnimals, showTreatmentHistory, owners }) => {
    const currentTime = new Date()
    const history = useHistory()

    //set state of a boolean to control when to display details of an animal
    const [detailsOpen, setDetailsOpen] = useState(false)
    //set set state for employee with a deault of false
    const [isEmployee, setAuth] = useState(false)
    //set state for all animalOwners
    const [allOwners, registerOwners] = useState([])
    //sets state for all employees
    const [allEmployees, updateEmployees] = useState([])
    //sets value of Owner dropdown menu
    const [owner, selectOwner] = useState(0)
    const [caretaker, selectCaretaker] = useState(0)
    //sets class names for html

    const [classes, defineClasses] = useState("card animal")
    //destructuring to return current user obj
    const { getCurrentUser } = useSimpleAuth()
    const { animalId } = useParams()
    //sets state for currentAnimal
    let { resolveResource, resource: currentAnimal } = useResourceResolver()
    const [treatment, setTreatment] = useState({ description: "" })

    const handleTreatment = (event) => {
        event.preventDefault()

        const newTreatment = {
            animalId: currentAnimal.id,
            timestamp: currentTime.getTime(),
            description: treatment.description
        }

        fetchIt(`${Settings.remoteURL}/treatments`, "POST", JSON.stringify(newTreatment))
            .then((setTreatment({ description: "" })))

    }

    const handleCaretaker = (event) => {
        const resetAnimalId = currentAnimal.id
        const newCaretakerObject = {
            animalId: currentAnimal.id,
            userId: caretaker
        }
        let resetAnimal = {}
        event.preventDefault()
        if (caretaker) {

            return AnimalRepository.addAnimalCaretaker(newCaretakerObject)
                .then(resolveResource(resetAnimal, resetAnimalId, AnimalRepository.get))
                .then(selectCaretaker(0))
        }

    }
    const handleOwner = (event) => {
        const resetAnimalId = currentAnimal.id
        const newOwner = {
            animalId: currentAnimal.id,
            userId:owner
        }
        let resetAnimal = {}
        event.preventDefault()
        return AnimalOwnerRepository.assignOwner(newOwner)
            .then(resolveResource(resetAnimal, resetAnimalId, AnimalRepository.get))
            .then(selectOwner(0))
    }


    useEffect(() => {
        //returns a booleon for the employee property on users
        setAuth(getCurrentUser().employee)

        //sets resource to animal object embeded with animalOwners and animalCaretakers
        resolveResource(animal, animalId, AnimalRepository.get)
        OwnerRepository.getAllEmployees()
            .then(data => updateEmployees(data))

    }, [])

    useEffect(() => {
        
        let resetAnimal = {}
        resolveResource(resetAnimal, currentAnimal.id, AnimalRepository.get)
    }, [treatment])


    //listens to animalId to change and excutes code
    useEffect(() => {

        if (animalId) {
            defineClasses("card animal--single")
            setDetailsOpen(true)
            OwnerRepository.getAllCustomers()
                .then(data => registerOwners(data))
        }

    }, [animalId])



    //jsx containing all the html elements needed to display individuals cards for each animal
    return (
        <>
            <li className={classes}>
                <div className="card-body">
                    <div className="animal__header">
                        <h5 className="card-title">
                            <button className="link--card btn btn-link"
                                style={{
                                    cursor: "pointer",
                                    "textDecoration": "underline",
                                    "color": "rgb(94, 78, 196)"
                                }}
                                onClick={() => {
                                    if (isEmployee) {
                                        showTreatmentHistory(currentAnimal)
                                    }
                                    else {
                                        history.push(`/animals/${currentAnimal.id}`)

                                    }
                                }}> {currentAnimal.name} </button>
                        </h5>
                        <span className="card-text small">{currentAnimal.breed}</span>
                    </div>

                    <details open={detailsOpen}>
                        <summary className="smaller">
                            <meter min="0" max="100" value={Math.random() * 100} low="25" high="75" optimum="100"></meter>
                        </summary>

                        <section>
                            <h6>Caretaker(s)</h6>
                            <span className="small">
                                {/* 
                                    if currentAnimal has caretakers, iterates over caretakers
                                    and displayers each caretaker's name
                                */}
                                {currentAnimal.animalCaretakers?.map(caretaker => {
                                    return <div key={`user-${caretaker.id}`}>{caretaker.user.name}</div>
                                })}
                            </span>

                            {isEmployee &&
                                currentAnimal.animalCaretakers?.length < 2 ?

                                <select value={caretaker}
                                    name="caretaker"
                                    className="form-control small"
                                    onChange={(evt) => {
                                        selectCaretaker(parseInt(evt.target.value))
                                    }}>
                                    <option value="">
                                        Select {currentAnimal.animalCaretakers?.length === 1 ? "another" : "an"} caretaker
                                    </option>
                                    {
                                        allEmployees.map(employee => <option key={employee.id} value={employee.id}>{employee.name}</option>)
                                    }
                                </select>
                                : ""


                            }
                            {
                                isEmployee && currentAnimal.animalCaretakers?.length < 2
                                    ? <button className="btn btn-warning mt-3 form-control small" onClick={handleCaretaker}>Assign Caretaker</button>
                                    : ""
                            }


                            <h6>Owners</h6>
                            <span className="small">
                                {
                                    currentAnimal.animalOwners?.map(owner => <div key={`owner--${owner.id}`}>{owner.user.name}</div>)
                                }
                            </span>


                            {
                                isEmployee && currentAnimal.animalOwners?.length < 2
                                    ? <select value={owner}
                                        name="owner"
                                        className="form-control small"
                                        onChange={(evt) => {
                                            selectOwner(parseInt(evt.target.value))
                                        }} >
                                        <option value="">
                                            Select {currentAnimal.animalOwners?.length === 1 ? "another" : "an"} owner
                                        </option>
                                        {
                                            animalId ? allOwners.map(o => {
                                               
                                            return <option key={`animalOwner--${o.id}`} value={o.id}>{o.name}</option>})
                                                : owners.map(o => <option key={`animalOwner--${o.id}`} value={o.id}>{o.name}</option>)

                                        }

                                    </select>
                                    : null
                            }

                            {
                                isEmployee && currentAnimal.animalOwners?.length < 2
                                    ? <button className="btn btn-warning mt-3 form-control small" onClick={handleOwner}>Assign Owner</button>
                                    : ""
                            }


                            {
                                isEmployee
                                    ? <form>
                                        <label htmlFor="treatment">Treatment: </label>
                                        <input
                                            required autoFocus
                                            type="text"
                                            className="form-control small"
                                            placeholder="Add treatment"
                                            onChange={
                                                (evt) => {
                                                    const copy = { ...treatment }
                                                    copy.description = evt.target.value
                                                    setTreatment(copy)
                                                }}
                                            value={treatment.description} />
                                    </form>
                                    : ""
                            }


                            {
                                detailsOpen && "treatments" in currentAnimal
                                    ? <div className="small">
                                        <h6>Treatment History</h6>
                                        {
                                            currentAnimal.treatments.map(t => (
                                                <div key={t.id}>
                                                    <p style={{ fontWeight: "bolder", color: "grey" }}>
                                                        {new Date(t.timestamp).toLocaleString("en-US")}
                                                    </p>
                                                    <p>{t.description}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    : ""
                            }

                        </section>

                        {
                            isEmployee ? <button className="btn btn-warning mt-3 form-control small" onClick={handleTreatment}>Add Treatment</button>
                                : ""
                        }


                        {
                            isEmployee ? <button className="btn btn-warning mt-3 form-control small" onClick={() =>
                                AnimalOwnerRepository
                                    .removeOwnersAndCaretakers(currentAnimal.id)
                                    .then(() => { AnimalRepository.delete(currentAnimal.id) }) // Remove animal
                                    .then(() => { syncAnimals() }) // Get all animals
                            }>Discharge</button>
                                : ""
                        }

                    </details>
                </div>
            </li>
        </>
    )
}
