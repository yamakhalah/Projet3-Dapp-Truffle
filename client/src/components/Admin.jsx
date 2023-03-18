import { useState, useEffect } from "react"
import { useEth } from '../contexts/EthContext'
import { Container, Box, Typography, TextField, Button, Grid } from '@mui/material'
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
        console.log('ADD ADDRESS', formValue)
        await contract.methods.addVoter(formValue).send({ from: accounts[0] })
        setFormValue("");
        alert("Adress added");
        window.location.reload();
    }

    const handleStepChange = async () => {
        switch(currentStep) {
            case 0:
                await votingContractService.startProposalRegistering();
                setCurrentStep(1);
                break;
            case 1:
                await votingContractService.endProposalRegistering()
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
    }

    return (
        isOwner && (
            <Container>
                <Typography variant="h1" component="h2">
                    Admin Pannel
                </Typography>
                {currentStep === 0 && (
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Typography variant="h2" component="h3">
                            Add voter
                        </Typography>
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Add
                        </Button>

                    </Box>
                )}
                <Typography variant="h2" component="h3">
                    Change Workflow Status
                </Typography>
                <Grid container>
                    {steps.map((step, index) => {
                        if(index === currentStep +1) {
                            return (
                                <Grid item key={step} xs={6}>
                                    <Button variant="contained" size="medium" onClick={handleStepChange}>
                                        {step}
                                    </Button>
                                </Grid>
                            )
                        }
                    })}
                </Grid>
            </Container>
        )
    )
}

export default Admin