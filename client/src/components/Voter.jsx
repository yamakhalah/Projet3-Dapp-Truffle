import { useState, useEffect } from "react"
import { useEth } from '../contexts/EthContext'
import {Box, Button, Container, FormControlLabel, Radio, TextField, FormControl, RadioGroup, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useStyles } from '../theme'
import { EventName, VotingContractService } from '../services/VotingContractService.ts'


function Voter({ propsProposals, setPropsProposals, currentStep, setWinner }) {
    const classes = useStyles();
    const {
        state: { accounts, contract, artifact },
    } = useEth();
    const[formValue, setFormValue] = useState("")
    const[proposals, setProposals] = useState([])
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

            if(contract) {
                const eProposals = await service.getPastEvents(EventName.ProposalRegistered);
                const proposalsId = eProposals.map((proposal) => proposal.returnValues.proposalId);
                let data = new Array();
                for(const id of proposalsId) {
                    const proposal = await service.getOneProposal(id);
                    proposal.push(
                        {
                            key: id,
                            description: proposal.description
                        }
                    )
                }
                setProposals(data);
            }

        }
        init();
    }, [currentStep, accounts, contract, artifact])

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
        <Grid container spacing={2} className={classes.gridContainer}>
            <Grid item md={12}>
                <Typography variant="h1" component="div">
                    Voter Pannel
                </Typography>
            </Grid>
            {isVoter && (
                <Container maxWidth='xl'>
                    {currentStep === 1 && (
                        <Grid item md={6} className={classes.gridItem}>
                            <Box component="form" onSubmit={handleVote} noValidate>
                                <Typography variant="h2" component="h3" align="center">
                                    Add Proposal
                                </Typography>
                                <Grid item md={12}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="proposal"
                                        label="Proposal ID"
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
                            <Box component="form" onSubmit={handleAddProposal} noValidate>
                                <Typography variant="h2" component="h3" align="center">
                                    Vote for proposal
                                </Typography>
                                <Grid item md={12}>
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="proposals"
                                            defaultValue="1"
                                            name="proposals"
                                            value={selectedProposal}
                                            onChange={handleSwitchProposal}
                                        >
                                            {proposals.map((proposal) => {
                                                <FormControlLabel key={proposal.id} control={<Radio />} label={proposal.id} value={proposal.description} />
                                            })}
                                        </RadioGroup>
                                    </FormControl>
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
                </Container>
            )}
        </Grid>
    )
}

export default Voter