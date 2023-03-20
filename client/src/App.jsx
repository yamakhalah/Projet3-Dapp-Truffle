import { useState } from 'react';
import { EthProvider } from "./contexts/EthContext";
import Admin from './components/Admin';
import ProposalsList from './components/ProposalsList';
import Voter from './components/Voter';
import VotersList from './components/VotersList';
import Winner from './components/Winner'
import {CssBaseline} from "@mui/material";
import { ThemeProvider } from '@mui/material/styles'
import { defaultTheme } from "./theme"

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [proposals, setProposals] = useState([]);
  const steps = [
      "RegisteringVoters",
      "ProposalsRegistrationStarted",
      "ProposalsRegistrationEnded",
      "VotingSessionStarted",
      "VotingSessionEnded",
      "VoteTallied"
  ]

  return (
        <ThemeProvider theme={defaultTheme}>
                <CssBaseline />
                <EthProvider>
                    <div id="App">
                        <div className="container">
                                <Winner currentStep={currentStep}/>
                                <Admin currentStep={currentStep} setCurrentStep={setCurrentStep} steps={steps}/>
                                <ProposalsList proposals={proposals} setProposals={setProposals}/>
                                <Voter proposals={proposals} currentStep={currentStep}/>
                                <VotersList />
                        </div>
                    </div>
            </EthProvider>
        </ThemeProvider>
  );
}

export default App;
