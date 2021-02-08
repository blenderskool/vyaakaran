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

export { getNodeConfig, edgeConfig };
