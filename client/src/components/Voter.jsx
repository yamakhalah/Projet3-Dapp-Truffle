import { useState, useEffect } from "react"
import { useEth } from '../contexts/EthContext'
import {Box, Button, Container, FormControlLabel, Radio, TextField, FormControl, RadioGroup, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useStyles } from '../theme'
import { EventName, VotingContractService } from '../services/VotingContractService.ts'


function Voter({ proposals, currentStep, setWinner }) {
    const classes = useStyles();
    const {
        state: { accounts, contract, artifact },
    } = useEth();
    const[formValue, setFormValue] = useState("")
    const[selectedProposal, setSelectedProposal] = useState(null)
    const[hasVoted, setHasVoted] = useState(true);
    const[isVoter, setIsVoter] = useState(false);
    const[service, setService] = useState(null)

    useEffect(() => {
        const service = VotingContractService.getInstance(accounts, contract)
        setService(service);
        async function init() {
            if(artifact) {
                let voters = await service.getPastEvents(EventName.VoterRegistered);
                const voter = voters.find((voter) => voter.returnValues.voterAddress === accounts[0])
                if (voter) {
                    setIsVoter(true)
                    const data = await service.getVoter(voter.returnValues.voterAddress);
                    setHasVoted(data.hasVoted);
                }
            }
        }
        init();
    }, [currentStep, proposals, accounts, contract, artifact])

    const handleAddProposal = async (e) => {
        e.preventDefault();
        if(formValue === ""){
            alert("We need a proposal description")
            return;
        }
        await service.addProposal(formValue);
        alert('Proposal added');
        window.location.reload();
    }

    const handleVote = async (e) => {
        e.preventDefault()
        await service.setVote(parseInt(selectedProposal));
        window.location.reload();
    }

    const handleSwitchProposal = async (e) => {
        setSelectedProposal(e.currentTarget.value);
    }

    const handleChangeDescription = async (e) => {
        setFormValue(e.currentTarget.value);
    }
    return (
        isVoter && (
            <Grid container spacing={2} className={classes.gridContainer}>
                <Grid item md={12}>
                    <Typography variant="h1" component="div">
                        Voter Pannel
                    </Typography>
                </Grid>
                <Container maxWidth='xl'>
                    {currentStep === 1 && (
                        <Grid item md={6} className={classes.gridItem}>
                            <Box component="form" onSubmit={handleAddProposal} noValidate>
                                <Typography variant="h2" component="h3" align="center">
                                    Add Proposal
                                </Typography>
                                <Grid item md={12}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="proposal"
                                        label="Proposal description"
                                        name="proposal"
                                        autoFocus
                                        onChange={handleChangeDescription}
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Add Proposal
                                    </Button>
                                </Grid>
                            </Box>
                        </Grid>
                    )}
                    {(currentStep === 3 && !hasVoted) && (
                        <Grid item md={6} className={classes.gridItem}>
                            <Box component="form" onSubmit={handleVote} noValidate>
                                <Typography variant="h2" component="h3" align="center">
                                    Vote for proposal
                                </Typography>
                                <Grid container md={12} justifyContent="center">
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="proposals"
                                            defaultValue="1"
                                            name="proposals"
                                            value={selectedProposal}
                                            onChange={handleSwitchProposal}
                                        >
                                            {proposals.map((proposal) => {
                                                return(
                                                    <FormControlLabel key={proposal.key} control={<Radio />} label={proposal.key} value={proposal.key+": "+proposal.description} />
                                                )
                                            })}
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} mdOffset={3}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Vote
                                    </Button>
                                </Grid>
                            </Box>
                        </Grid>
                    )}
                    {(currentStep === 3 && hasVoted === true) && (
                        <Typography variant="h2" component="h3" align="center" className={classes.gridItem}>
                            You have already voted
                        </Typography>
                    )}
                </Container>
            </Grid>
        )
    )
}

export default Voter