import { useEffect, useState } from "react"

const useResourceResolver = () => {

    const [resource, setResource] = useState({})

    useEffect(() => {
       console.log('resolved resource', resource)
    }, [resource])

    const resolveResource = (property, param, getter) => {
        // Checking if property is an object
        // should come from the property of the Component
        // where resolveResource is being invoked
        if (property && "id" in property) {
            // if property exists and has an id key
            // set it as the resource in state
            setResource(property)
        }
        else {
            // If being rendered indepedently
            // if property does not exist or no id
            if (param) {
                // invoke the passed getter function with param as input
                // then set to the resource in state
                getter(param).then(retrievedResource => {
                    setResource(retrievedResource)
                })
            }
        }
    }

    return { resolveResource, resource }
}

export default useResourceResolver
