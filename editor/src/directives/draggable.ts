// directives/draggable.ts
import { DirectiveBinding } from 'vue';

const draggable = {
  mounted(el: HTMLElement) {
    el.style.position = 'absolute';
    el.style.cursor = 'move';

    el.onmousedown = function (event) {
      event.preventDefault();

      const shiftX = event.clientX - el.getBoundingClientRect().left;
      const shiftY = event.clientY - el.getBoundingClientRect().top;

      const moveAt = (pageX: number, pageY: number) => {
        el.style.left = pageX - shiftX + 'px';
        el.style.top = pageY - shiftY + 'px';
      };

      const onMouseMove = (event: MouseEvent) => {
        moveAt(event.pageX, event.pageY);
      };

      document.addEventListener('mousemove', onMouseMove);

      el.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        el.onmouseup = null;
      };
    };

    el.ondragstart = function () {
      return false;
    };
  },
};

export default draggable;
