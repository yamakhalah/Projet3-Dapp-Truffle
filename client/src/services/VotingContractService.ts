import { useEth } from '../contexts/EthContext';
import { Contract } from 'web3-eth-contract';
import { Accounts } from 'web3-eth-accounts'

class VotingContractService {

    static INSTANCE: VotingContractService = null;

    private owner: any;
    private contract: Contract;
    private accounts: Accounts;

    private constructor(accounts, contract) {
        this.contract = contract;
        this.accounts = accounts;
    }

    static getInstance(): VotingContractService {
        const {
            data: { accounts, contract },
        } = useEth();
        //Check if accounts and contract changed.

        if(this.INSTANCE === null) {
            this.INSTANCE = new VotingContractService(accounts, contract);
        }
        return this.INSTANCE;
    }

    public async getOwner() {
        return await this.contract.methods.owner().call({ from: this.accounts[0]});
    }

    public async getStep() {
        return await this.contract.methods.workflowStatus().call({ from: this.accounts[0]})
    }

}