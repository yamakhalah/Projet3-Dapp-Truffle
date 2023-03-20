import { useState, useEffect } from "react"
import { useEth } from '../contexts/EthContext'
import {Grid, List, ListItem, ListItemText, Typography} from '@mui/material'
import {EventName, VotingContractService} from "../services/VotingContractService.ts";
import { useStyles } from '../theme'

function ProposalsList({ proposals, setProposals }) {
    const classes = useStyles();
    const {
        state: { accounts, contract, artifact },
    } = useEth();
    const[service, setService] = useState(null)
    const [isVoter, setIsVoter] = useState(false)

    useEffect(() => {
        const service = VotingContractService.getInstance(accounts, contract)
        setService(service);
        async function init() {
            if(artifact) {
                let voters = await service.getPastEvents(EventName.VoterRegistered);
                const voter = voters.find((voter) => voter.returnValues.voterAddress === accounts[0])
                if (voter) {
                    setIsVoter(true)
                    const eProposals = await service.getPastEvents(EventName.ProposalRegistered);
                    const proposalsId = eProposals.map((proposal) => proposal.returnValues.proposalId);
                    let data = new Array();
                    for(const id of proposalsId) {
                        const proposal = await service.getOneProposal(id);
                        data.push(
                            {
                                key: id,
                                description: proposal.description
                            }
                        )
                    }
                    setProposals(data);
                }
            }
        }
        init()
    }, [accounts, contract, artifact])

    return (
        isVoter && (
            <Grid container spacing={2} className={classes.gridContainer}>
                <Grid item md={12}>
                    <Typography variant="h1" component="div">
                        Proposals List
                    </Typography>
                </Grid>
                <Grid item md={12} className={classes.gridItem}>
                    <List>
                        {proposals.map((proposal) => {
                            return (
                                <ListItem key={proposal.key}>
                                    <ListItemText
                                        primaryTypographyProps={{fontSize: '18px'}}
                                        primary={"Description: "+proposal.description}
                                        secondary={"ID: "+proposal.key}
                                    />
                                </ListItem>
                            )
                        })}
                    </List>
                </Grid>
            </Grid>
        )
    )
}

export default ProposalsList