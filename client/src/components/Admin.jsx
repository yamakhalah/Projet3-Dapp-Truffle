import { useState, useEffect } from "react"
import { useEth } from '../contexts/EthContext'
import { Box } from '@mui/material'

function Admin({ currentStep, setCurrentStep, steps }) {
    const {
        state: { accounts, contract, artifact },
    } = useEth();
    const [isOwner, setIsOwner]  = useState(false)

    useEffect(() => {
        async function getStep() {
            if(artifact) {
                const step = await contract.methods.workflowStatus().call({ from: accounts[0] });
                setCurrentStep(parseInt(step));
            }
        }

        async function getOwner() {
            const owner = await contract.methods.owner().call({ from: accounts[0]})
            accounts[0] === owner ? setIsOwner(true) : setIsOwner(false);
        }

        getOwner();
        getStep();
    }, [currentStep, accounts, contract, artifact])

    return (
        isOwner && (
            <Box>TEST</Box>
        )
    )
}

export default Admin