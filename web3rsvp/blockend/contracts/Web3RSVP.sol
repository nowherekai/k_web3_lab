// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Web3RSVP {
  struct Event {
    uint eventId;
    string eventDataCID;
    address creator;
    uint256 startTime;
    uint256 deposit;
    uint256 maxCapacity;
    address[] confirmedRSVPs;
    address[] claimedRSVPs;
    bool paidOut;
  }

  uint private currentEventId = 1;

  mapping(uint => Event) public idToEvent;

  event NewEventCreated(
    uint256 eventID,
    address creatorAddress,
    uint256 eventStartTime,
    uint256 maxCapacity,
    uint256 deposit,
    string eventDataCID
  );

  event NewRSVP(uint256 eventID, address attendeeAddress);

  event ConfirmedAttendee(uint256 eventID, address attendeeAddress);

  event DepositsPaidOut(uint256 eventID);

  function createEvent(
    uint startTime,
    uint deposit,
    uint maxCapacity,
    string calldata eventDataCID
  ) public {

    idToEvent[currentEventId] = Event({
      eventId: currentEventId,
      eventDataCID: eventDataCID,
      creator: msg.sender,
      startTime: startTime,
      deposit: deposit,
      maxCapacity: maxCapacity,
      confirmedRSVPs: new address[](0),
      claimedRSVPs: new address[](0),
      paidOut: false
    });


    emit NewEventCreated(
      currentEventId,
      msg.sender,
      startTime,
      maxCapacity,
      deposit,
      eventDataCID
    );

    currentEventId += 1;
  }

  function createRSVP(uint eventId) external payable {
    Event storage selectedEvent = idToEvent[eventId];
    require(selectedEvent.creator != address(0), "event not created.");
    require(selectedEvent.deposit == msg.value, "deposit not enough.");
    require(selectedEvent.startTime >= block.timestamp, "event already happened");

    require(selectedEvent.confirmedRSVPs.length < selectedEvent.maxCapacity, "event has reached capacity");

    for (uint8 i = 0; i < selectedEvent.confirmedRSVPs.length; i++) {
      require(selectedEvent.confirmedRSVPs[i] != msg.sender, "ALREADY CONFIRMED");
    }

    selectedEvent.confirmedRSVPs.push(msg.sender);

    emit NewRSVP(eventId, msg.sender);
  }

  function confirmedRSVPs(uint eventId) external view returns (address[] memory) {
    return idToEvent[eventId].confirmedRSVPs;
  }

  function claimedRSVPs(uint eventId) external view returns (address[] memory) {
    return idToEvent[eventId].claimedRSVPs;
  }

  function confirmAttendee(uint eventId, address attendee) external {
    Event storage selectedEvent = idToEvent[eventId];
    require(selectedEvent.creator == msg.sender, "not event creator");

    for (uint8 i = 0; i < selectedEvent.confirmedRSVPs.length; i++) {
      if (selectedEvent.confirmedRSVPs[i] == attendee) {
        claimRSVP(eventId, selectedEvent.claimedRSVPs, attendee, selectedEvent.deposit);
      }
    }
  }

  function claimRSVP(uint256 eventId, address[] storage claimedRSVPs, address attendee, uint deposit) internal {
    for (uint j = 0; j < claimedRSVPs.length; j++) {
      if (claimedRSVPs[j] == attendee) {
        revert("already claimed");
      }
    }

    (bool sent,) = attendee.call{value: deposit}("");

    require(sent, "Failed to send Ether");
    claimedRSVPs.push(attendee);

    emit ConfirmedAttendee(eventId, attendee);
  }

  function confirmAllAttendees(uint eventId) external {
    Event storage selectedEvent = idToEvent[eventId];
    require(selectedEvent.creator == msg.sender, "not event creator");

    for (uint8 i = 0; i < selectedEvent.confirmedRSVPs.length; i++) {
      claimRSVP(eventId, selectedEvent.claimedRSVPs, selectedEvent.confirmedRSVPs[i], selectedEvent.deposit);
    }
  }

  function withdrawUnclaimedDeposits(uint eventId) external {
    Event storage selectedEvent = idToEvent[eventId];
    require(selectedEvent.creator == msg.sender, "not event creator");
    require(!selectedEvent.paidOut, "already paiout");
    require(block.timestamp >= (selectedEvent.startTime + 7 days), "TOO EARLY");

    uint256 unclaimed = selectedEvent.confirmedRSVPs.length - selectedEvent.claimedRSVPs.length;
    uint256 payout = unclaimed * selectedEvent.deposit;

    (bool sent, ) = msg.sender.call{value: payout}("");
    require(sent, "Failed to send Ether");
    selectedEvent.paidOut = true;

    emit DepositsPaidOut(eventId);
  }
}
