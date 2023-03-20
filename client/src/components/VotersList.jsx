import { useState, useEffect } from "react"
import { useEth } from '../contexts/EthContext'
import { List, ListItem, Typography, ListItemText } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { VotingContractService, EventName } from '../services/VotingContractService.ts'
import { useStyles } from '../theme'

function VotersList() {
    const classes = useStyles();
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
        <Grid container spacing={2} className={classes.gridContainer}>
            <Grid item md={12}>
                <Typography variant="h1" component="div">
                    Voters List
                </Typography>
            </Grid>
            <Grid item md={6} mdOffset={3} className={classes.gridItem}>
                <List>
                    {voters.map((voter) => {
                        return (
                            <ListItem key={voter}>
                                <ListItemText
                                    primaryTypographyProps={{fontSize: '18px'}}
                                    primary={voter}
                                />
                            </ListItem>
                        )
                    })}
                </List>
            </Grid>
        </Grid>
    )
}

export default VotersList