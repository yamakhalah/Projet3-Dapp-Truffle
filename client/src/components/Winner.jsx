import { useState, useEffect } from "react"
import { useEth } from '../contexts/EthContext'
import Grid from '@mui/material/Unstable_Grid2'
import { Typography} from '@mui/material'
import {useStyles} from "../theme";
import { VotingContractService } from "../services/VotingContractService.ts";

function Winner({ currentStep }) {
    const classes = useStyles();
    const {
        state: { accounts, contract, artifact },
    } = useEth();
    const [winner, setWinner] = useState(null)

    useEffect(() => {
        const votingContractService = VotingContractService.getInstance(accounts, contract)
        async function getWinner() {
            if(artifact) {
                const result = await votingContractService.getWinner();
                setWinner(result);
            }
        }

        getWinner()
    }, [currentStep, accounts, contract, artifact])

    return (winner !== null && currentStep >= 4) &&(
        <Grid container spacing={2} className={classes.gridContainer}>
            <Grid item md={12}>
                <Typography variant="h1" component="h2">
                    We have a winner !
                </Typography>
            </Grid>
            {}
            <Grid item md={6}  className={classes.gridItem}>
                <Typography variant="h3" component="h3" align="center">
                    {"Winner is: "+winner}
                </Typography>
            </Grid>
        </Grid>
    )
}

export default Winner