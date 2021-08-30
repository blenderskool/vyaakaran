import { onMounted, onUnmounted } from 'vue';

type Handler = (e: KeyboardEvent) => void;
type Predicate = string | ((e: KeyboardEvent) => boolean);

const useKeyShortcut = (predicate: Predicate, handler: Handler) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (typeof predicate === 'function' ? predicate(e) : e.code === predicate) {
      e.preventDefault();
      handler(e);
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
};

export default useKeyShortcut;
