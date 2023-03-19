import { Contract } from 'web3-eth-contract';

export enum EventName {
    VoterRegistered = "VoterRegistered",
    WorkflowStatusChange = "WorkflowStatusChange",
    ProposalRegistered = "ProposalRegistered",
    Voted = "Voted"
}

export class VotingContractService {

    private static INSTANCE: VotingContractService = null;

    private owner: String;
    private contract: Contract;
    private accounts: [String];

    private constructor(accounts: [String], contract: Contract) {
        this.contract = contract;
        this.accounts = accounts;
    }

    static getInstance(accounts: [String], contract: Contract): VotingContractService {
        if(accounts === null && contract === null) return null;
        if(this.INSTANCE === null) {
            this.INSTANCE = new VotingContractService(accounts, contract);
        }else if(this.INSTANCE.accounts[0] !== accounts[0]) {
            this.INSTANCE = new VotingContractService(accounts, contract);
        }
        console.log('INSTANCE', this.INSTANCE)
        return this.INSTANCE;
    }

    public async getOwner() {
        return await this.contract.methods.owner().call({ from: this.accounts[0]});
    }

    public async getStep() {
        return await this.contract.methods.workflowStatus().call({ from: this.accounts[0]})
    }

    public async getOneProposal(id: Number) {
        return await this.contract.methods.getOneProposal(id).call({ from: this.accounts[0]})
    }

    public async getVoter(address: String) {
        return await this.contract.methods.getVoter(address).call({ from: this.accounts[0]})
    }

    public async addVoter(voter: String) {
        await this.contract.methods.addVoter(voter).send({ from: this.accounts[0] })
    }

    public async addProposal(description: String) {
        await this.contract.methods.addProposal(description).send({ from: this.accounts[0] })
    }

    public async setVote(id: Number) {
        await this.contract.methods.setVote(id).send({ from: this.accounts[0] })
    }

    public async startProposalsRegistering() {
        await this.contract.methods.startProposalsRegistering().send({ from: this.accounts[0] })
    }

    public async endProposalsRegistering() {
        await this.contract.methods.endProposalsRegistering().send({ from: this.accounts[0] })
    }

    public async startVotingSession() {
        await this.contract.methods.startVotingSession().send({ from: this.accounts[0] })
    }

    public async endVotingSession() {
        await this.contract.methods.endVotingSession().send({ from: this.accounts[0] })
    }

    public async tallyVotes() {
        await this.contract.methods.tallyVotes().send({ from: this.accounts[0] })
    }

    public async getPastEvents(eventName: EventName) {
       const test = await this.contract.getPastEvents(eventName as string, { fromBlock: 0, toBlock: "latest"});
       console.log('PAST EVENT RESULT FOR '+eventName, test);
        return test;

    }

}