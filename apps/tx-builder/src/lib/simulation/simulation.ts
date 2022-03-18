import axios from 'axios';
import Web3 from 'web3';
import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk';
import { TenderlySimulatePayload, TenderlySimulation } from './types';
import { encodeMultiSendCall, getMultiSendCallOnlyAddress } from './multisend';

type OptionalExceptFor<T, TRequired extends keyof T = keyof T> = Partial<Pick<T, Exclude<keyof T, TRequired>>> &
  Required<Pick<T, TRequired>>;

// api docs: https://www.notion.so/Simulate-API-Documentation-6f7009fe6d1a48c999ffeb7941efc104
const SIMULATE_ENDPOINT = 'https://api.tenderly.co/api/v1/account/mikhail-gnosis/project/project/simulate';

const getSimulation = async (tx: TenderlySimulatePayload): Promise<TenderlySimulation> => {
  const response = await axios.post<TenderlySimulation>(SIMULATE_ENDPOINT, tx, {
    headers: {
      'X-Access-Key': 'Xem-IVnTYgo-hnw0cnmp-xzEHzeA-o-b',
    },
  });

  return response.data;
};

const getSimulationLink = (simulationId: string): string => {
  return `https://dashboard.tenderly.co/mikhail-gnosis/project/simulator/${simulationId}`;
};

/* We need to overwrite the threshold stored in smart contract storage to 1
 to do a proper simulation that takes transaction guards into account.
 The threshold is stored in storage slot 2 and uses full 32 bytes slot
 Safe storage layout can be found here:
 https://github.com/gnosis/safe-contracts/blob/main/contracts/libraries/GnosisSafeStorage.sol */
const THRESHOLD_ONE_STATE_OVERRIDE = {
  [`0x${'2'.padStart(64, '0')}`]: `0x${'1'.padStart(64, '0')}`,
};

interface SafeTransaction {
  to: string;
  value: string;
  data: string;
  safeTxGas: string;
  baseGas: string;
  gasPrice: string;
  gasToken: string;
  refundReceiver: string;
  nonce: string;
  operation: string;
}

interface SignedSafeTransaction extends SafeTransaction {
  signatures: string;
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const buildSafeTransaction = (template: OptionalExceptFor<SafeTransaction, 'to' | 'nonce'>): SafeTransaction => {
  return {
    to: template.to,
    value: template.value || '0',
    data: template.data || '0x',
    operation: template.operation || '0',
    safeTxGas: template.safeTxGas || '0',
    baseGas: template.baseGas || '0',
    gasPrice: template.gasPrice || '0',
    gasToken: template.gasToken || ZERO_ADDRESS,
    refundReceiver: template.refundReceiver || ZERO_ADDRESS,
    nonce: template.nonce,
  };
};

const encodeSafeExecuteTransactionCall = (tx: SignedSafeTransaction): string => {
  const web3 = new Web3();

  const encodedSafeExecuteTransactionCall = web3.eth.abi.encodeFunctionCall(
    {
      name: 'execTransaction',
      type: 'function',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
        { name: 'operation', type: 'uint8' },
        { name: 'safeTxGas', type: 'uint256' },
        { name: 'baseGas', type: 'uint256' },
        { name: 'gasPrice', type: 'uint256' },
        { name: 'gasToken', type: 'address' },
        { name: 'refundReceiver', type: 'address' },
        { name: 'signatures', type: 'bytes' },
      ],
    },
    [
      tx.to,
      tx.value,
      tx.data,
      tx.operation,
      tx.safeTxGas,
      tx.baseGas,
      tx.gasPrice,
      tx.gasToken,
      tx.refundReceiver,
      tx.signatures,
    ],
  );

  return encodedSafeExecuteTransactionCall;
};

const getPreValidatedSignature = (address: string): string => {
  return `0x000000000000000000000000${address.replace(
    '0x',
    '',
  )}000000000000000000000000000000000000000000000000000000000000000001`;
};

type SimulationTxParams = {
  safeAddress: string;
  safeNonce: string;
  executionOwner: string;
  transactions: BaseTransaction[];
  chainId: string;
  gasLimit: number;
};

const getMultiSendSimulationPayload = (tx: SimulationTxParams): TenderlySimulatePayload => {
  const safeTransactionData = encodeMultiSendCall(tx.transactions);
  const multiSendAddress = getMultiSendCallOnlyAddress(tx.chainId);
  const safeTransaction = buildSafeTransaction({
    to: multiSendAddress,
    value: '0',
    data: safeTransactionData,
    nonce: tx.safeNonce,
    operation: '1',
  });
  const signedSafeTransaction: SignedSafeTransaction = {
    ...safeTransaction,
    signatures: getPreValidatedSignature(tx.executionOwner),
  };
  const executionTransactionData = encodeSafeExecuteTransactionCall(signedSafeTransaction);

  return {
    network_id: tx.chainId,
    from: tx.executionOwner,
    to: tx.safeAddress,
    input: executionTransactionData,
    gas: tx.gasLimit,
    state_objects: {
      [tx.safeAddress]: THRESHOLD_ONE_STATE_OVERRIDE,
    },
    save: false,
  };
};

export { getSimulationLink, getSimulation, getMultiSendSimulationPayload };
