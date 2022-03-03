import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { Animal } from "./Animal"
import { AnimalDialog } from "./AnimalDialog"
import AnimalRepository from "../../repositories/AnimalRepository"
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository"
import useModal from "../../hooks/ui/useModal"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth"
import OwnerRepository from "../../repositories/OwnerRepository"

import "./AnimalList.css"
import "./cursor.css"


export const AnimalListComponent = (props) => {
    // initializes animals and setter function petAnimals
    // inially empty array
    const [animals, petAnimals] = useState([])
    const [ownerAnimals, setOwnerAnimals] = useState([])
    // initializes animalOwners and setter function setAnimalOwners
    const [animalOwners, setAnimalOwners] = useState([])
    // initializes owners and setter function updateOwners
    const [owners, updateOwners] = useState([])
    // initializes currentAnimal and setter function setCurrentAnimal
    // initially object with treatments:[] as only property
    const [currentAnimal, setCurrentAnimal] = useState({ treatments: [] })
    // gets the getCurrentUser function from useSimpleAuth
    const { getCurrentUser } = useSimpleAuth()
    // useHistory hook
    const history = useHistory()
    // sets up toggleDialog function and modalIsOpen variable from useModal hook
    let { toggleDialog, modalIsOpen } = useModal("#dialog--animal")

    // function that invokes getAll() function from AnimalRepository
    // then uses petAnimals to update animals state
    const syncAnimals = () => {
        getCurrentUser().employee ?
            AnimalRepository.getAll().then(data => petAnimals(data))
            :
            AnimalRepository.getAll().then(data => {
                const matchedAnimals = data.filter(animal => {
                    return animal.animalOwners.find(animalOwner => animalOwner.userId === getCurrentUser().id )}
                
                )
                petAnimals(matchedAnimals)})
            }



// this useEffect only triggers on page load
// invokes three functions getAllCustomers, getAll from AnimalOwnerRepository
// and getAll from AnimalRepository
// updates state values from the returns of these function calls
useEffect(() => {
    OwnerRepository.getAllCustomers().then(updateOwners)
    AnimalOwnerRepository.getAll().then(setAnimalOwners)
    syncAnimals()
}, [])

// function that takes animal object as parameter
// setCurrentAnimal in state to update currentAnimal state
// invokes toggleDialog from useModal hook
const showTreatmentHistory = animal => {
    setCurrentAnimal(animal)
    toggleDialog()
}

// useEffect triggers when toggleDialog or modalIsOpen changes
// this allows escape key to be used to close dialog
useEffect(() => {
    const handler = e => {
        // event keyCode = escape button and modalIsOpen
        if (e.keyCode === 27 && modalIsOpen) {
            // run toggleDialog()
            toggleDialog()
        }
    }
    // adds eventListener
    window.addEventListener("keyup", handler)
    console.log("event useEffect fired")
    // removes eventListener?
    return () => window.removeEventListener("keyup", handler)
}, [toggleDialog, modalIsOpen])





return (

    <>
        {/* 
                Invokes AnimalDialog component
                props.toggleDialog = toggleDialog function
                props.animal = currentAnimal state
            */}
        <AnimalDialog toggleDialog={toggleDialog} animal={currentAnimal} />


        {   // getCurrentUser checks the user token
            // employee is a boolean value
            getCurrentUser().employee
                // if true return empty string
                ? ""
                // if false return new animal button
                : <div className="centerChildren btn--newResource">
                    <button type="button"
                        className="btn btn-success "
                        onClick={() => { history.push("/animals/new") }}>
                        Register Animal
                    </button>
                </div>
        }

        {/* list of animals */}
        <ul className="animals">
            {
                animals.map(anml =>
                    // invokes the Animal components
                    /*
                        props.animal = anml
                        props.animalOwners = animalOwners from state
                        props.owners = owners from state
                        props.syncAnimals = syncAnimals function
                        props.setAnimalOwners = setAnimalOwners function
                        props.showTreatmentHistory = showTreatmentHistory function
                    */

                    <Animal key={`animal--${anml.id}`} animal={anml}
                        animalOwners={animalOwners}
                        owners={owners}
                        syncAnimals={syncAnimals}
                        setAnimalOwners={setAnimalOwners}
                        showTreatmentHistory={showTreatmentHistory}
                    />)

            }

        </ul>
    </>
)

}
