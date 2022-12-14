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

export class OptionCreated extends ethereum.Event {
  get params(): OptionCreated__Params {
    return new OptionCreated__Params(this);
  }
}

export class OptionCreated__Params {
  _event: OptionCreated;

  constructor(event: OptionCreated) {
    this._event = event;
  }

  get tokenAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get creator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get underlying(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get collateral(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get barrierPrice(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get expiry(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get isUp(): boolean {
    return this._event.parameters[6].value.toBoolean();
  }

  get isPlus(): boolean {
    return this._event.parameters[7].value.toBoolean();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class KIOptionFactory__createOptionResult {
  value0: Address;
  value1: Address;

  constructor(value0: Address, value1: Address) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    return map;
  }

  getValue0(): Address {
    return this.value0;
  }

  getValue1(): Address {
    return this.value1;
  }
}

export class KIOptionFactory extends ethereum.SmartContract {
  static bind(address: Address): KIOptionFactory {
    return new KIOptionFactory("KIOptionFactory", address);
  }

  addressRouter(): Address {
    let result = super.call("addressRouter", "addressRouter():(address)", []);

    return result[0].toAddress();
  }

  try_addressRouter(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "addressRouter",
      "addressRouter():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  createOption(
    _underlyingAsset: Address,
    _collateralAsset: Address,
    _multiplier: BigInt,
    _barrierPrice: BigInt,
    _expiry: BigInt,
    _isUp: boolean
  ): KIOptionFactory__createOptionResult {
    let result = super.call(
      "createOption",
      "createOption(address,address,uint256,uint256,uint256,bool):(address,address)",
      [
        ethereum.Value.fromAddress(_underlyingAsset),
        ethereum.Value.fromAddress(_collateralAsset),
        ethereum.Value.fromUnsignedBigInt(_multiplier),
        ethereum.Value.fromUnsignedBigInt(_barrierPrice),
        ethereum.Value.fromUnsignedBigInt(_expiry),
        ethereum.Value.fromBoolean(_isUp)
      ]
    );

    return new KIOptionFactory__createOptionResult(
      result[0].toAddress(),
      result[1].toAddress()
    );
  }

  try_createOption(
    _underlyingAsset: Address,
    _collateralAsset: Address,
    _multiplier: BigInt,
    _barrierPrice: BigInt,
    _expiry: BigInt,
    _isUp: boolean
  ): ethereum.CallResult<KIOptionFactory__createOptionResult> {
    let result = super.tryCall(
      "createOption",
      "createOption(address,address,uint256,uint256,uint256,bool):(address,address)",
      [
        ethereum.Value.fromAddress(_underlyingAsset),
        ethereum.Value.fromAddress(_collateralAsset),
        ethereum.Value.fromUnsignedBigInt(_multiplier),
        ethereum.Value.fromUnsignedBigInt(_barrierPrice),
        ethereum.Value.fromUnsignedBigInt(_expiry),
        ethereum.Value.fromBoolean(_isUp)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new KIOptionFactory__createOptionResult(
        value[0].toAddress(),
        value[1].toAddress()
      )
    );
  }

  getOptionAddress(
    _underlyingAsset: Address,
    _collateralAsset: Address,
    _barrierPrice: BigInt,
    _expiry: BigInt,
    _isUp: boolean,
    _isPlus: boolean
  ): Address {
    let result = super.call(
      "getOptionAddress",
      "getOptionAddress(address,address,uint256,uint256,bool,bool):(address)",
      [
        ethereum.Value.fromAddress(_underlyingAsset),
        ethereum.Value.fromAddress(_collateralAsset),
        ethereum.Value.fromUnsignedBigInt(_barrierPrice),
        ethereum.Value.fromUnsignedBigInt(_expiry),
        ethereum.Value.fromBoolean(_isUp),
        ethereum.Value.fromBoolean(_isPlus)
      ]
    );

    return result[0].toAddress();
  }

  try_getOptionAddress(
    _underlyingAsset: Address,
    _collateralAsset: Address,
    _barrierPrice: BigInt,
    _expiry: BigInt,
    _isUp: boolean,
    _isPlus: boolean
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getOptionAddress",
      "getOptionAddress(address,address,uint256,uint256,bool,bool):(address)",
      [
        ethereum.Value.fromAddress(_underlyingAsset),
        ethereum.Value.fromAddress(_collateralAsset),
        ethereum.Value.fromUnsignedBigInt(_barrierPrice),
        ethereum.Value.fromUnsignedBigInt(_expiry),
        ethereum.Value.fromBoolean(_isUp),
        ethereum.Value.fromBoolean(_isPlus)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getOptionId(
    _underlyingAsset: Address,
    _collateralAsset: Address,
    _barrierPrice: BigInt,
    _expiry: BigInt,
    _isUp: boolean,
    _isPlus: boolean
  ): Bytes {
    let result = super.call(
      "getOptionId",
      "getOptionId(address,address,uint256,uint256,bool,bool):(bytes32)",
      [
        ethereum.Value.fromAddress(_underlyingAsset),
        ethereum.Value.fromAddress(_collateralAsset),
        ethereum.Value.fromUnsignedBigInt(_barrierPrice),
        ethereum.Value.fromUnsignedBigInt(_expiry),
        ethereum.Value.fromBoolean(_isUp),
        ethereum.Value.fromBoolean(_isPlus)
      ]
    );

    return result[0].toBytes();
  }

  try_getOptionId(
    _underlyingAsset: Address,
    _collateralAsset: Address,
    _barrierPrice: BigInt,
    _expiry: BigInt,
    _isUp: boolean,
    _isPlus: boolean
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "getOptionId",
      "getOptionId(address,address,uint256,uint256,bool,bool):(bytes32)",
      [
        ethereum.Value.fromAddress(_underlyingAsset),
        ethereum.Value.fromAddress(_collateralAsset),
        ethereum.Value.fromUnsignedBigInt(_barrierPrice),
        ethereum.Value.fromUnsignedBigInt(_expiry),
        ethereum.Value.fromBoolean(_isUp),
        ethereum.Value.fromBoolean(_isPlus)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  getOptionsLength(): BigInt {
    let result = super.call(
      "getOptionsLength",
      "getOptionsLength():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getOptionsLength(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getOptionsLength",
      "getOptionsLength():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  optionIdToAddress(param0: Bytes): Address {
    let result = super.call(
      "optionIdToAddress",
      "optionIdToAddress(bytes32):(address)",
      [ethereum.Value.fromFixedBytes(param0)]
    );

    return result[0].toAddress();
  }

  try_optionIdToAddress(param0: Bytes): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "optionIdToAddress",
      "optionIdToAddress(bytes32):(address)",
      [ethereum.Value.fromFixedBytes(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  options(param0: BigInt): Address {
    let result = super.call("options", "options(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toAddress();
  }

  try_options(param0: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall("options", "options(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class CreateOptionCall extends ethereum.Call {
  get inputs(): CreateOptionCall__Inputs {
    return new CreateOptionCall__Inputs(this);
  }

  get outputs(): CreateOptionCall__Outputs {
    return new CreateOptionCall__Outputs(this);
  }
}

export class CreateOptionCall__Inputs {
  _call: CreateOptionCall;

  constructor(call: CreateOptionCall) {
    this._call = call;
  }

  get _underlyingAsset(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _collateralAsset(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _multiplier(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _barrierPrice(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _expiry(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get _isUp(): boolean {
    return this._call.inputValues[5].value.toBoolean();
  }
}

export class CreateOptionCall__Outputs {
  _call: CreateOptionCall;

  constructor(call: CreateOptionCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.outputValues[0].value.toAddress();
  }

  get value1(): Address {
    return this._call.outputValues[1].value.toAddress();
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get _addressRouter(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}
