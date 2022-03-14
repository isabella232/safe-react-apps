import axios from 'axios';
import { TenderlySimulatePayload, TenderlySimulation } from './types';

// api docs: https://www.notion.so/Simulate-API-Documentation-6f7009fe6d1a48c999ffeb7941efc104
const SIMULATE_ENDPOINT = 'https://api.tenderly.co/api/v1/account/mikhail-gnosis/project/project/simulate';

const simulateTransaction = async (tx: TenderlySimulatePayload): Promise<TenderlySimulation> => {
  const response = await axios.post<TenderlySimulation>(SIMULATE_ENDPOINT, tx);

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

const getMultiSendSimulationPayload = (transactions): TenderlySimulatePayload => {};

export { getSimulationLink, simulateTransaction };
