// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

//一次投票，多个议案
contract SimpleVoting {
  struct Proposal {
    string description;
    uint votingCount;
  }

  struct Voter {
    bool isRegistered;
    bool hasVoted;
    uint votedProposalId;
  }

  enum WorkflowStatus {
    RegisteringVoters,
    ProposalsRegistrationStarted,
    ProposalsRegistrationEnded,
    VotingSessionStarted,

    VotingSessionEnded,
    VotesTallied
  }

  event VoterRegistered(address voterAddress);

  address public administrator;

  WorkflowStatus public workflowStatus;

  mapping(address => Voter) voters;

  Proposal[] proposals;

  uint256 private winningProposalId;

  constructor() {
    administrator = msg.sender;
    workflowStatus = WorkflowStatus.RegisteringVoters;
  }

  modifier onlyAdmin() {
    require(msg.sender == administrator, "not admin!");
    _;
  }

  modifier onlyRegisteredVoter() {
    Voter storage v = voters[msg.sender];
    require(v.isRegistered, "voter must be registered!");
    _;
  }

  modifier onlyDuringVotersRegisteration() {
    require(WorkflowStatus.RegisteringVoters == workflowStatus, "");
    _;
  }

  modifier onlyDuringProposalRegisteration() {
    require(WorkflowStatus.ProposalsRegistrationStarted == workflowStatus, "");
    _;
  }

  modifier onlyAfterProposalsRegistration() {
    require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded,  
            "this function can be called only after proposals registration has ended");
            _;
  }

  modifier onlyDuringVotingSession() {
    require(workflowStatus == WorkflowStatus.VotingSessionStarted, 
            "this function can be called only during the voting session");
            _;
  }


  modifier onlyAfterVotingSession() {
    require(workflowStatus == WorkflowStatus.VotingSessionEnded,  
            "this function can be called only after the voting session has ended");
            _;
  }

  modifier onlyAfterVotesTallied() {
    require(workflowStatus == WorkflowStatus.VotesTallied,  
            "this function can be called only after votes have been tallied");
            _;

  }

  function getProposals() public view returns (Proposal[] memory) {
    return proposals;
  }

  function getProposalById(uint id) public view returns (Proposal memory) {
    return proposals[id];
  }

  function getWinningProposalId() public view returns (uint) {
    return winningProposalId;
  }

  function isRegisteredVoter() public view returns (bool) {
    return voters[msg.sender].isRegistered;
  }

  function isAdmin() public view returns (bool) {
    return administrator == msg.sender;
  }

  function startVotingSession() public onlyAdmin onlyAfterProposalsRegistration {
    workflowStatus = WorkflowStatus.VotingSessionStarted;
  }

  function endVotingSession() public onlyAdmin onlyDuringVotingSession {
    workflowStatus = WorkflowStatus.VotingSessionEnded;
  }

  function registerVoters(address[] calldata _voterAddresses) public onlyAdmin onlyDuringVotersRegisteration {
    for(uint i = 0; i < _voterAddresses.length; i++) {
      Voter storage voter = voters[_voterAddresses[i]];
      if (!voter.isRegistered) {
        voter.isRegistered = true;
        emit VoterRegistered(_voterAddresses[i]);
      }
    }
  }

  function startProposalsRegistration() public onlyAdmin onlyDuringVotersRegisteration {
    workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
  }

  function endProposalsRegistration() public onlyAdmin onlyDuringProposalRegisteration {
    workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
  }

  //注册提案
  function registerProposal(string calldata description) public onlyAdmin onlyDuringVotersRegisteration {
    Proposal memory proposal = Proposal(description,0);
    proposals.push(proposal);
  }

  function vote(uint proposalId) public onlyRegisteredVoter onlyDuringProposalRegisteration {
    Voter storage voter = voters[msg.sender];
    require(!voter.hasVoted, "has voted!");

    voter.hasVoted = true;
    voter.votedProposalId = proposalId;

    proposals[proposalId].votingCount += 1;
  }

  function tallyVotes() public onlyAdmin onlyAfterVotingSession {
    uint maxVoteCount;
    uint winningId;

    for (uint i = 0; i < proposals.length; i++) {
      Proposal storage proposal = proposals[i];
      if (maxVoteCount < proposal.votingCount) {
        maxVoteCount = proposal.votingCount;
        winningId = i;
      }
    }
    winningProposalId = winningId;

    workflowStatus = WorkflowStatus.VotesTallied;
  }
}

