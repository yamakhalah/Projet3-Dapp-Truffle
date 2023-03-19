import { useState, useEffect } from "react"
import { useEth } from '../contexts/EthContext'
import { Container, Box, Typography, TextField, Button } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { VotingContractService } from "../services/VotingContractService.ts";


function Admin({ currentStep, setCurrentStep, steps }) {
    const {
        state: { accounts, contract, artifact },
    } = useEth();
    const [isOwner, setIsOwner]  = useState(false)
    const [formValue, setFormValue] = useState("");
    const [votingContractService, setVotingContractService] = useState(null);

    useEffect(() => {
        const votingContractService = VotingContractService.getInstance(accounts, contract)
        setVotingContractService(votingContractService);
        async function getStep() {
            if(artifact) {
                const step = await votingContractService.getStep();
                setCurrentStep(parseInt(step));
            }
        }

        async function getOwner() {
            const owner = await votingContractService.getOwner();
            accounts[0] === owner ? setIsOwner(true) : setIsOwner(false);
        }

        getOwner();
        getStep();
    }, [currentStep, accounts, contract, artifact])

    const handleChange = (e) => {
        setFormValue(e.currentTarget.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formValue === "") {
            alert("Address not set")
            return;
        }
        await votingContractService.addVoter(formValue);
        alert("Adress added");
        window.location.reload();
    }

    const handleStepChange = async () => {
        switch(currentStep) {
            case 0:
                await votingContractService.startProposalsRegistering();
                setCurrentStep(1);
                break;
            case 1:
                await votingContractService.endProposalsRegistering()
                setCurrentStep(2);
                break;
            case 2:
                await votingContractService.startVotingSession();
                setCurrentStep(3);
                break;
            case 3:
                await votingContractService.endVotingSession();
                setCurrentStep(4);
                break;
            case 4:
                await votingContractService.tallyVotes();
                setCurrentStep(5)
                break;
            case 5:
                setCurrentStep(0);
                break;
            default:
                break;
        }
        window.location.reload();
    }

    return (
        isOwner && (
            <Grid container spacing={2}>
                <Grid item md={12}>
                    <Typography variant="h1" component="h2">
                        Admin Pannel
                    </Typography>
                </Grid>
                <Grid item md={6}>
                    {currentStep === 0 && (
                        <Grid item md={6}  mdOffset={3}>
                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                <Typography variant="h2" component="h3" align="center">
                                    Add voter
                                </Typography>
                                <Grid item md={12}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Voter Address"
                                        name="address"
                                        autoFocus
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Add
                                    </Button>
                                </Grid>
                            </Box>
                        </Grid>
                    )}
                </Grid>
                <Grid item md={6}>
                        <Typography variant="h2" component="h3" align="center">
                            Change Workflow Status
                        </Typography>
                    {steps.map((step, index) => {
                        if(index === currentStep +1) {
                            return (
                                <Grid item key={step} md={6} mdOffset={3}>
                                    <Button variant="contained" size="large" onClick={handleStepChange} fullWidth>
                                        {step}
                                    </Button>
                                </Grid>
                            )
                        }
                    })}
                </Grid>
            </Grid>
        )
    )
}

export default Admin