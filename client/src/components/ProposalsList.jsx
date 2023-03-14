import { useState, useEffect } from "react"
import { useEth } from '../contexts/EthContext'
import { Box } from '@mui/material'

function ProposalsList({ proposals }) {

    return (
        <Box>
            <div>
                {proposals.forEach(proposal => {
                    <div></div>
                })}
            </div>
        </Box>
    )
}

export default ProposalsList