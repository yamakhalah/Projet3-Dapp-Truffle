import { useState, useEffect } from "react"
import { useEth } from '../contexts/EthContext'
import { Box } from '@mui/material'

function Winner({ winner, currentStep }) {

    useEffect(() => {

    }, [winner, currentStep])

    return (winner !== null && currentStep >= 4) &&(
        <Box>Winner box</Box>
    )
}

export default Winner