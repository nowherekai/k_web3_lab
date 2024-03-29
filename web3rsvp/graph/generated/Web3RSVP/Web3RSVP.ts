// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class ConfirmedAttendee extends ethereum.Event {
  get params(): ConfirmedAttendee__Params {
    return new ConfirmedAttendee__Params(this);
  }
}

export class ConfirmedAttendee__Params {
  _event: ConfirmedAttendee;

  constructor(event: ConfirmedAttendee) {
    this._event = event;
  }

  get eventID(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get attendeeAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class DepositsPaidOut extends ethereum.Event {
  get params(): DepositsPaidOut__Params {
    return new DepositsPaidOut__Params(this);
  }
}

export class DepositsPaidOut__Params {
  _event: DepositsPaidOut;

  constructor(event: DepositsPaidOut) {
    this._event = event;
  }

  get eventID(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class NewEventCreated extends ethereum.Event {
  get params(): NewEventCreated__Params {
    return new NewEventCreated__Params(this);
  }
}

export class NewEventCreated__Params {
  _event: NewEventCreated;

  constructor(event: NewEventCreated) {
    this._event = event;
  }

  get eventID(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get creatorAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get eventStartTime(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get maxCapacity(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get deposit(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get eventDataCID(): string {
    return this._event.parameters[5].value.toString();
  }
}

export class NewRSVP extends ethereum.Event {
  get params(): NewRSVP__Params {
    return new NewRSVP__Params(this);
  }
}

export class NewRSVP__Params {
  _event: NewRSVP;

  constructor(event: NewRSVP) {
    this._event = event;
  }

  get eventID(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get attendeeAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Web3RSVP__idToEventResult {
  value0: BigInt;
  value1: string;
  value2: Address;
  value3: BigInt;
  value4: BigInt;
  value5: BigInt;
  value6: boolean;

  constructor(
    value0: BigInt,
    value1: string,
    value2: Address,
    value3: BigInt,
    value4: BigInt,
    value5: BigInt,
    value6: boolean
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromString(this.value1));
    map.set("value2", ethereum.Value.fromAddress(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    map.set("value5", ethereum.Value.fromUnsignedBigInt(this.value5));
    map.set("value6", ethereum.Value.fromBoolean(this.value6));
    return map;
  }
}

export class Web3RSVP extends ethereum.SmartContract {
  static bind(address: Address): Web3RSVP {
    return new Web3RSVP("Web3RSVP", address);
  }

  claimedRSVPs(eventId: BigInt): Array<Address> {
    let result = super.call(
      "claimedRSVPs",
      "claimedRSVPs(uint256):(address[])",
      [ethereum.Value.fromUnsignedBigInt(eventId)]
    );

    return result[0].toAddressArray();
  }

  try_claimedRSVPs(eventId: BigInt): ethereum.CallResult<Array<Address>> {
    let result = super.tryCall(
      "claimedRSVPs",
      "claimedRSVPs(uint256):(address[])",
      [ethereum.Value.fromUnsignedBigInt(eventId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddressArray());
  }

  confirmedRSVPs(eventId: BigInt): Array<Address> {
    let result = super.call(
      "confirmedRSVPs",
      "confirmedRSVPs(uint256):(address[])",
      [ethereum.Value.fromUnsignedBigInt(eventId)]
    );

    return result[0].toAddressArray();
  }

  try_confirmedRSVPs(eventId: BigInt): ethereum.CallResult<Array<Address>> {
    let result = super.tryCall(
      "confirmedRSVPs",
      "confirmedRSVPs(uint256):(address[])",
      [ethereum.Value.fromUnsignedBigInt(eventId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddressArray());
  }

  idToEvent(param0: BigInt): Web3RSVP__idToEventResult {
    let result = super.call(
      "idToEvent",
      "idToEvent(uint256):(uint256,string,address,uint256,uint256,uint256,bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new Web3RSVP__idToEventResult(
      result[0].toBigInt(),
      result[1].toString(),
      result[2].toAddress(),
      result[3].toBigInt(),
      result[4].toBigInt(),
      result[5].toBigInt(),
      result[6].toBoolean()
    );
  }

  try_idToEvent(
    param0: BigInt
  ): ethereum.CallResult<Web3RSVP__idToEventResult> {
    let result = super.tryCall(
      "idToEvent",
      "idToEvent(uint256):(uint256,string,address,uint256,uint256,uint256,bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Web3RSVP__idToEventResult(
        value[0].toBigInt(),
        value[1].toString(),
        value[2].toAddress(),
        value[3].toBigInt(),
        value[4].toBigInt(),
        value[5].toBigInt(),
        value[6].toBoolean()
      )
    );
  }
}

export class ConfirmAllAttendeesCall extends ethereum.Call {
  get inputs(): ConfirmAllAttendeesCall__Inputs {
    return new ConfirmAllAttendeesCall__Inputs(this);
  }

  get outputs(): ConfirmAllAttendeesCall__Outputs {
    return new ConfirmAllAttendeesCall__Outputs(this);
  }
}

export class ConfirmAllAttendeesCall__Inputs {
  _call: ConfirmAllAttendeesCall;

  constructor(call: ConfirmAllAttendeesCall) {
    this._call = call;
  }

  get eventId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ConfirmAllAttendeesCall__Outputs {
  _call: ConfirmAllAttendeesCall;

  constructor(call: ConfirmAllAttendeesCall) {
    this._call = call;
  }
}

export class ConfirmAttendeeCall extends ethereum.Call {
  get inputs(): ConfirmAttendeeCall__Inputs {
    return new ConfirmAttendeeCall__Inputs(this);
  }

  get outputs(): ConfirmAttendeeCall__Outputs {
    return new ConfirmAttendeeCall__Outputs(this);
  }
}

export class ConfirmAttendeeCall__Inputs {
  _call: ConfirmAttendeeCall;

  constructor(call: ConfirmAttendeeCall) {
    this._call = call;
  }

  get eventId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get attendee(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConfirmAttendeeCall__Outputs {
  _call: ConfirmAttendeeCall;

  constructor(call: ConfirmAttendeeCall) {
    this._call = call;
  }
}

export class CreateEventCall extends ethereum.Call {
  get inputs(): CreateEventCall__Inputs {
    return new CreateEventCall__Inputs(this);
  }

  get outputs(): CreateEventCall__Outputs {
    return new CreateEventCall__Outputs(this);
  }
}

export class CreateEventCall__Inputs {
  _call: CreateEventCall;

  constructor(call: CreateEventCall) {
    this._call = call;
  }

  get startTime(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get deposit(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get maxCapacity(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get eventDataCID(): string {
    return this._call.inputValues[3].value.toString();
  }
}

export class CreateEventCall__Outputs {
  _call: CreateEventCall;

  constructor(call: CreateEventCall) {
    this._call = call;
  }
}

export class CreateRSVPCall extends ethereum.Call {
  get inputs(): CreateRSVPCall__Inputs {
    return new CreateRSVPCall__Inputs(this);
  }

  get outputs(): CreateRSVPCall__Outputs {
    return new CreateRSVPCall__Outputs(this);
  }
}

export class CreateRSVPCall__Inputs {
  _call: CreateRSVPCall;

  constructor(call: CreateRSVPCall) {
    this._call = call;
  }

  get eventId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CreateRSVPCall__Outputs {
  _call: CreateRSVPCall;

  constructor(call: CreateRSVPCall) {
    this._call = call;
  }
}

export class WithdrawUnclaimedDepositsCall extends ethereum.Call {
  get inputs(): WithdrawUnclaimedDepositsCall__Inputs {
    return new WithdrawUnclaimedDepositsCall__Inputs(this);
  }

  get outputs(): WithdrawUnclaimedDepositsCall__Outputs {
    return new WithdrawUnclaimedDepositsCall__Outputs(this);
  }
}

export class WithdrawUnclaimedDepositsCall__Inputs {
  _call: WithdrawUnclaimedDepositsCall;

  constructor(call: WithdrawUnclaimedDepositsCall) {
    this._call = call;
  }

  get eventId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class WithdrawUnclaimedDepositsCall__Outputs {
  _call: WithdrawUnclaimedDepositsCall;

  constructor(call: WithdrawUnclaimedDepositsCall) {
    this._call = call;
  }
}
