const Voting = artifacts.require("./Voting.sol");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

contract("\n /********************** Test de Voting.sol **********************/\n", (accounts) => {
  const owner = accounts[0];
  const Voter1 = accounts[1];
  const Voter2 = accounts[2];
  const Voter3 = accounts[3];
  const nonVoter = accounts[4];

  let VotingInstance;

  describe("\n /**********/\n Test de addVoter function\n /**********/\n", function () {
    beforeEach(async function () {
      VotingInstance = await Voting.new({ from: owner });
      await VotingInstance.addVoter(owner, { from: owner });
    });

    it("the owner can register a voter \n  expect(voter.isRegistered).to.equal(true); \n        CONGRAT SUCCESS in =====>", async () => {
      await VotingInstance.addVoter(Voter1, { from: owner });
      const voter = await VotingInstance.getVoter(Voter1);
      expect(voter.isRegistered).to.equal(true);
    });

    // REVERT
    it("revert when caller is not the owner \n          CONGRAT SUCCESS in =====>", async () => {
      await expectRevert(
        VotingInstance.addVoter(Voter2, { from: Voter1 }),
        "Ownable: caller is not the owner"
      );
    });

    it("revert when voters registration is not open \n          CONGRAT SUCCESS in =====>", async () => {
      await VotingInstance.startProposalsRegistering();
      await expectRevert(
        VotingInstance.addVoter(Voter1, { from: owner }),
        "Voters registration is not open yet"
      );
    });

    it("revert when voter is already registered \n          CONGRAT SUCCESS in =====>", async () => {
      await expectRevert(
        VotingInstance.addVoter(owner, { from: owner }),
        "Already registered"
      );
    });

    // EVENT
    it("emit a VoterRegistered event \n          CONGRAT SUCCESS in =====>", async () => {
      expectEvent(
        await VotingInstance.addVoter(Voter1, {
          from: owner,
        }),
        "VoterRegistered",
        { voterAddress: Voter1 }
      );
    });

    describe("\n /**********/\n Test de getVoter function\n /**********/\n", function () {
      it("revert when caller is not a voter", async () => {
        await expectRevert(
          VotingInstance.getVoter(owner, {
            from: nonVoter,
          }),
          "You're not a voter"
        );
      });
    });

    describe("\n /**********/\nTest de  startProposalsRegistering function\n /**********/\n", function () {
      it("change workflowStatus to ProposalsRegistrationStarted", async function () {
        await VotingInstance.startProposalsRegistering({ from: owner });
        const workflowStatus = await VotingInstance.workflowStatus.call();
        expect(workflowStatus).to.be.bignumber.equal(new BN(1));
      });

      it("add 'LA GENESE DE LA FIRST PROPOSAL' as first proposal", async function () {
        await VotingInstance.startProposalsRegistering({ from: owner });
        const firstProposal = await VotingInstance.getOneProposal(0);
        expect(firstProposal.description).equal("LA GENESE DE LA FIRST PROPOSAL");
      });

      // REVERT
      it("revert when caller is not the owner", async () => {
        await expectRevert(
          VotingInstance.startProposalsRegistering({ from: Voter1 }),
          "Ownable: caller is not the owner"
        );
      });

      it("revert when registering proposals cant be started now", async () => {
        await VotingInstance.startProposalsRegistering({ from: owner });
        await expectRevert(
          VotingInstance.startProposalsRegistering({ from: owner }),
          "Registering proposals cant be started now"
        );
      });

      // EVENT
      it("emit a WorkflowStatusChange event", async () => {
        expectEvent(
          await VotingInstance.startProposalsRegistering({
            from: owner,
          }),
          "WorkflowStatusChange",
          { previousStatus: new BN(0), newStatus: new BN(1) }
        );
      });
    });

    describe("\n /**********/\nTest de addProposal function\n /**********/\n", function () {
      beforeEach(async function () {
        await VotingInstance.addVoter(Voter1, { from: owner });
        await VotingInstance.addVoter(Voter2, { from: owner });
        await VotingInstance.addVoter(Voter3, { from: owner });
        await VotingInstance.startProposalsRegistering({ from: owner });
      });

      it("the voters add proposals", async function () {
        await VotingInstance.addProposal("avoir une semaine de 4 jours", {
          from: Voter1,
        });
        const proposal = await VotingInstance.getOneProposal(1);
        expect(proposal.description).equal("avoir une semaine de 4 jours");
      });

      // REVERT
      it("revert when caller is not a voter", async () => {
        await expectRevert(
          VotingInstance.addProposal("desc proposition 99", {
            from: nonVoter,
          }),
          "You're not a voter"
        );
      });

      it("revert when proposals are not allowed yet", async () => {
        await VotingInstance.endProposalsRegistering();
        await expectRevert(
          VotingInstance.addProposal("desc proposition 99", { from: owner }),
          "Proposals are not allowed yet"
        );
      });

      it("revert when description is empty", async () => {
        await expectRevert(
          VotingInstance.addProposal("", { from: Voter1 }),
          "Vous ne pouvez pas ne rien proposer"
        );
      });

      // EVENT
      it("emit a ProposalRegistered event", async () => {
        expectEvent(
          await VotingInstance.addProposal("avoir une semaine de 4 jours", {
            from: owner,
          }),
          "ProposalRegistered",
          { proposalId: new BN(1) }
        );
      });

      describe("\n /**********/\nTest de getOneProposal function\n /**********/\n", function () {
        it("revert when caller is not a voter", async () => {
          await expectRevert(
            VotingInstance.getOneProposal(0, {
              from: nonVoter,
            }),
            "You're not a voter"
          );
        });
      });

      describe("\n /**********/\nTest de endProposalsRegistering function\n /**********/\n", function () {
        it("change workflowStatus to ProposalsRegistrationEnded", async function () {
          await VotingInstance.endProposalsRegistering({ from: owner });
          const workflowStatus = await VotingInstance.workflowStatus.call();
          expect(workflowStatus).to.be.bignumber.equal(new BN(2));
        });

        // REVERT
        it("revert when caller is not the owner", async () => {
          await expectRevert(
            VotingInstance.endProposalsRegistering({ from: Voter1 }),
            "Ownable: caller is not the owner"
          );
        });

        it("revert when registering proposals havent started yet", async () => {
          await VotingInstance.endProposalsRegistering({ from: owner });
          await expectRevert(
            VotingInstance.endProposalsRegistering({ from: owner }),
            "Registering proposals havent started yet"
          );
        });

        // EVENT
        it("emit a WorkflowStatusChange event", async () => {
          expectEvent(
            await VotingInstance.endProposalsRegistering({
              from: owner,
            }),
            "WorkflowStatusChange",
            { previousStatus: new BN(1), newStatus: new BN(2) }
          );
        });
      });

      describe("\n /**********/\nTest de startVotingSession function\n /**********/\n", function () {
        it("change workflowStatus to VotingSessionStarted", async function () {
          await VotingInstance.endProposalsRegistering({ from: owner });
          await VotingInstance.startVotingSession({ from: owner });
          const workflowStatus = await VotingInstance.workflowStatus.call();
          expect(workflowStatus).to.be.bignumber.equal(new BN(3));
        });

        // REVERT
        it("revert when caller is not the owner", async () => {
          await expectRevert(
            VotingInstance.startVotingSession({ from: Voter1 }),
            "Ownable: caller is not the owner"
          );
        });

        it("revert when registering proposals phase is not finished", async () => {
          await expectRevert(
            VotingInstance.startVotingSession({ from: owner }),
            "Registering proposals phase is not finished"
          );
        });

        // EVENT
        it("emit a WorkflowStatusChange event", async () => {
          await VotingInstance.endProposalsRegistering({ from: owner });
          expectEvent(
            await VotingInstance.startVotingSession({
              from: owner,
            }),
            "WorkflowStatusChange",
            { previousStatus: new BN(2), newStatus: new BN(3) }
          );
        });
      });

      describe("\n /**********/\nTest de setVote function\n /**********/\n", function () {
        beforeEach(async function () {
          await VotingInstance.addProposal("desc proposition 1", {
            from: Voter1,
          });
          await VotingInstance.addProposal("desc proposition 2", {
            from: Voter2,
          });
          await VotingInstance.addProposal("desc proposition 3", {
            from: Voter3,
          });
          await VotingInstance.endProposalsRegistering({ from: owner });
          await VotingInstance.startVotingSession({ from: owner });
        });

        it("proposal voteCount property increment", async function () {
          const firstProposalBefore = await VotingInstance.getOneProposal(1);
          await VotingInstance.setVote(1, { from: owner });
          const firstProposalAfter = await VotingInstance.getOneProposal(1);

          expect(firstProposalAfter.voteCount).to.be.bignumber.equal(
            firstProposalBefore.voteCount + 1
          );
        });

        it("voter hasVoted property become true", async function () {
          await VotingInstance.setVote(1, { from: owner });
          const voter = await VotingInstance.getVoter(owner, { from: owner });
          expect(voter.hasVoted).to.be.true;
        });

        it("voter votedProposalId property update", async function () {
          await VotingInstance.setVote(1, { from: owner });
          const voter = await VotingInstance.getVoter(owner, { from: owner });

          expect(voter.votedProposalId).to.be.bignumber.equal(new BN(1));
        });

        // REVERT
        it("revert when caller is not a voter", async () => {
          await expectRevert(
            VotingInstance.setVote(1, { from: nonVoter }),
            "You're not a voter"
          );
        });

        it("revert when voting session havent started yet", async () => {
          await VotingInstance.endVotingSession();
          await expectRevert(
            VotingInstance.setVote(1, { from: owner }),
            "Voting session havent started yet"
          );
        });

        it("revert when voter has already voted", async () => {
          await VotingInstance.setVote(1, { from: owner });
          await expectRevert(
            VotingInstance.setVote(1, { from: owner }),
            "You have already voted"
          );
        });

        it("revert when proposal is not found", async () => {
          await expectRevert(
            VotingInstance.setVote(4, { from: owner }),
            "Proposal not found"
          );
        });

        // EVENT
        it("emit a Voted event", async () => {
          expectEvent(
            await VotingInstance.setVote(1, {
              from: owner,
            }),
            "Voted",
            { voter: owner, proposalId: new BN(1) }
          );
        });

        describe("\n /**********/\nTest de endVotingSession function\n /**********/\n", function () {
          it("change workflowStatus to VotingSessionEnded", async function () {
            await VotingInstance.endVotingSession({ from: owner });
            const workflowStatus = await VotingInstance.workflowStatus.call();
            expect(workflowStatus).to.be.bignumber.equal(new BN(4));
          });

          // REVERT
          it("revert when caller is not the owner", async () => {
            await expectRevert(
              VotingInstance.endVotingSession({ from: Voter1 }),
              "Ownable: caller is not the owner"
            );
          });

          it("revert when voting session havent started yet", async () => {
            await VotingInstance.endVotingSession({ from: owner });
            await expectRevert(
              VotingInstance.endVotingSession({ from: owner }),
              "Voting session havent started yet"
            );
          });

          // EVENT
          it("emit a WorkflowStatusChange event", async () => {
            expectEvent(
              await VotingInstance.endVotingSession({
                from: owner,
              }),
              "WorkflowStatusChange",
              { previousStatus: new BN(3), newStatus: new BN(4) }
            );
          });
        });

        describe("\n /**********/\nLast Test de tallyVotes function\n /**********/\n", function () {
          beforeEach(async function () {
            await VotingInstance.setVote(2, { from: owner });
            await VotingInstance.setVote(1, { from: Voter1 });
            await VotingInstance.setVote(2, { from: Voter2 });
            await VotingInstance.setVote(3, { from: Voter3 });
            await VotingInstance.endVotingSession({ from: owner });
          });

          it("change workflowStatus to VotesTallied", async function () {
            await VotingInstance.tallyVotes({ from: owner });
            const workflowStatus = await VotingInstance.workflowStatus.call();
            expect(workflowStatus).to.be.bignumber.equal(new BN(5));
          });

          it("set winningProposalId", async function () {
            await VotingInstance.tallyVotes({ from: owner });
            const winningProposalId =
              await VotingInstance.winningProposalID.call();
            expect(winningProposalId).to.be.bignumber.equal(new BN(2));
          });

          // REVERT
          it("revert when caller is not the owner", async () => {
            await expectRevert(
              VotingInstance.tallyVotes({ from: Voter1 }),
              "Ownable: caller is not the owner"
            );
          });

          it("revert when current status is not voting session ended", async () => {
            await VotingInstance.tallyVotes({ from: owner });
            await expectRevert(
              VotingInstance.tallyVotes({ from: owner }),
              "Current status is not voting session ended"
            );
          });

          // EVENT
          it("GOOD Job CONGRATULATION --- emit a WorkflowStatusChange event", async () => {
            expectEvent(
              await VotingInstance.tallyVotes({
                from: owner,
              }),
              "WorkflowStatusChange",
              { previousStatus: new BN(4), newStatus: new BN(5) }
            );
          });
        });
      });
    });
  });
});
