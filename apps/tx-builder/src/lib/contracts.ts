import { getMultiSendCallOnlyDeployment } from '@gnosis.pm/safe-deployments';

const getMultiSendCallOnlyAddress = (chainId: string): string => {
  const deployment = getMultiSendCallOnlyDeployment({ network: chainId });

  if (!deployment) {
    throw new Error('MultiSendCallOnly deployment not found');
  }

  return deployment.networkAddresses[chainId];
};

export { getMultiSendCallOnlyAddress };
