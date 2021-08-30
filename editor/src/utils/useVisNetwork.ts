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

export default useVisNetwork;
