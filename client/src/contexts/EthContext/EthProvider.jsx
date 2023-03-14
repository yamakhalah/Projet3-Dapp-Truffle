import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifact => {
      console.log('ARTIFACT')
      console.log(artifact);
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        console.log('WEB3', web3)
        const accounts = await web3.eth.requestAccounts();
        console.log('ACCOUNTS', accounts)
        const networkID = await web3.eth.net.getId();
        console.log('NETWORK ID', networkID)
        const { abi } = artifact;
        console.log('ABI', abi);
        let address, contract;
        try {
          address = artifact.networks[networkID].address;
          console.log('ADDRESS INIT')
          contract = new web3.eth.Contract(abi, address);
          console.log('CONTRACT INIT')
          console.log(contract);
        } catch (err) {
          console.log('INIT ERROR')
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts, networkID, contract }
        });
      }
    }, []);
//ARTIFACT
  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = require("../../contracts/Voting.json");
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
