import { useState } from 'react';
import { EthProvider } from "./contexts/EthContext";
import Admin from './components/Admin';
import ProposalsList from './components/ProposalsList';
import Voter from './components/Voter';
import VotersList from './components/VotersList';
import Winner from './components/Winner'

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [winner, setWinner] = useState(null);
  const steps = [
      "RegisteringVoters",
      "ProposalsRegistrationStarted",
      "ProposalsRegistrationEnded",
      "VotingSessionStarted",
      "VotingSessionEnded",
      "VoteTallied"
  ]

  return (
    <EthProvider>
        {console.log('AFTER ETH PROVIDER')}
      <div id="App">
          <div className="container">
            <Winner winner={winner} currentStep={currentStep}/>
            <Admin currentStep={currentStep} setCurrentStep={setCurrentStep} steps={steps}/>
            <ProposalsList proposals={{proposals}}/>
            <Voter proposals={proposals} setProposals={setProposals} currentStep={currentStep} setWinner={setWinner}/>
            <VotersList />
          </div>
      </div>
    </EthProvider>
  );
}

export default App;
