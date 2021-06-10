import { Ref, ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';

type VisNetworkLib = typeof import('vis-network/peer/esm/vis-network');
type VisDataLib = typeof import('vis-data/peer/esm/vis-data');

/**
 * Dynamically loads vis-network and vis-data libraries
 */
const useVisNetwork = (): [Ref<boolean>, Ref<VisNetworkLib>, Ref<VisDataLib>] => {
  const loading = ref<boolean>(true);
  const networkLib = ref<VisNetworkLib>({} as VisNetworkLib);
  const dataLib = ref<VisDataLib>({} as VisDataLib);

  onMounted(async () => {
    const result = await Promise.all([
      import('vis-network/peer/esm/vis-network'),
      import('vis-data/peer/esm/vis-data'),
    ]);
    networkLib.value = result[0];
    dataLib.value = result[1];
    loading.value = false;
  });

  return [loading, networkLib, dataLib];
};

const getNodeConfig = (node: string, final: boolean) => ({
  id: node,
  label: node,
  shape: 'circle',
  color: {
    border: '#5d8cc0',
    background: '#27272A',
    highlight: {
      background: '#444c55',
      border: '#88b4e7',
    },
  },
  font: {
    color: '#d6e9ff',
    face: 'Fira Code',
  },
  ...(final ? {
    borderWidth: 4,
    borderWidthSelected: 4,
  } : {}),
});

const edgeConfig = {
  arrows: {
    to: {
      enabled: true,
      scaleFactor: 0.3,
    },
  },
  color: '#586f89',
  font: {
    multi: 'md',
    strokeWidth: 0,
    color: '#34febb',
    face: 'Fira Code',
    background: '#27272A',
  },
  selfReference: {
    size: 15,
    angle: Math.PI / 1.2,
  },
};

export { getNodeConfig, edgeConfig, useVisNetwork };
