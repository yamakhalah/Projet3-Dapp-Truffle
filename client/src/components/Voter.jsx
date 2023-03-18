import { useState, useEffect } from "react"
import { useEth } from '../contexts/EthContext'
import {Box, Typography} from '@mui/material'
import { EventName, VotingContractService } from '../services/VotingContractService.ts'

function Voter({ propsProposals, setPropsProposals, currentPhase, setWinner }) {
    const {
        state: { accounts, contract, artifact },
    } = useEth();
    const[formValue, setFormValue] = UseState("")
    const[proposals, setProposals] = UseState([])
    const[selectedProposal, setSelectedProposal] = UseState(null)
    const[hasVoted, setHasVoted] = UseState(true);
    const[isVoter, setIsVoter] = UseState(false);
    const[service, setService] = UseState(null)

    useEffect(() => {
        const contractService = VotingContractService.getInstance(accounts, contract)
        setService(contractService);
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
    }, [accounts, contract, artifact])

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

    const handleSwitchProposal = async (e, data) => {
        setSelectedProposal(data.value);
    }
    return (
        <Box>
            <Typography variant="h2" component="div">
                Voter pannel
            </Typography>
        isVoter && {
            <Box>
            {currentPhase === 1 && (
                <Typography variant="h4" component="div">
                    Add Proposal
                </Typography>
            )}
            {(currentPhase === 3 && !hasVoted) && (
                <Typography variant="h4" component="div">
                    Vote for proposal
                </Typography>
            )}
            </Box>
        }
        </Box>
    )
}

export default Voter