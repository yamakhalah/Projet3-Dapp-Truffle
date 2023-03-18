import { useState, useEffect } from "react"
import { useEth } from '../contexts/EthContext'
import { Box, Grid, List, ListItem, Typography, ListItemText } from '@mui/material'
import { VotingContractService, EventName } from '../services/VotingContractService.ts'

function VotersList() {
    const {
        state: { accounts, contract, artifact },
    } = useEth();
    const [voters, setVoters] = useState([]);

    useEffect(() => {
        async function init() {
            if (artifact) {
                const event = await VotingContractService.getInstance(accounts, contract).getPastEvents(EventName.VoterRegistered);
                let voters = event.map((voter) => voter.returnValues.voterAddress);
                setVoters(voters)
            }
        }
        init();
    }, [accounts, contract, artifact])


    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h2" component="div">
                        Voters List
                    </Typography>
                        <List>
                            {voters.map((voter) => {
                                return (
                                    <ListItem key={voter}>
                                        <ListItemText
                                            primary={voter}
                                        />
                                    </ListItem>
                                )
                            })}
                        </List>
                </Grid>
            </Grid>
        </Box>
    )
}

export default VotersList