import React from "react"
import { Route } from "react-router-dom"
import {Animal} from "./animals/Animal"
import AnimalForm from "./animals/AnimalForm"
import { AnimalListComponent } from "./animals/AnimalList"

export default () => {
    return (
        <>
            {/* 
                when url path is /animals
                AnimalListComponent loads with no passed props
            */}
            <Route exact path="/animals">
                <AnimalListComponent />
            </Route>
            <Route path="/animals/:animalId(\d+)">
                <Animal />
            </Route>
            <Route path="/animals/new">
                <AnimalForm />
            </Route>
        </>
    )
}
