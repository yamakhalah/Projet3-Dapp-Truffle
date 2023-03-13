import { useState, useEffect } from "react"
import { useEth } from '../contexts/EthContext'
import { Box } from '@mui/material'

function Winner({ winner, currentPhase }) {

    return (winner !== null && currentPhase >= 4) &&(
        <Box>Winner box</Box>
    )
}

export default Winner