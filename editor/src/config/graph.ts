const getNodeConfig = (node: string, final: boolean) => {
	const nodeConfig = {
		id: node,
		label: node,
		shape: "circle",
		color: {
			border: "#64748B",
			background: "#27272A",
			highlight: {
				background: "#444c55",
				border: "#88b4e7",
			},
		},
		font: {
			color: "#d6e9ff",
			face: "Fira Code",
		},
	};

	if (final) {
		return {
			...nodeConfig,
			borderWidth: 4,
			borderWidthSelected: 4,
			color: {
				...nodeConfig.color,
				border: "#0D9488",
			},
		};
	}

	return nodeConfig;
};

const edgeConfig = {
	arrows: {
		to: {
			enabled: true,
			scaleFactor: 0.3,
		},
	},
	color: "#475569",
	font: {
		multi: "md",
		strokeWidth: 0,
		color: "#67E8F9",
		face: "Fira Code",
		background: "#27272A",
	},
	selfReference: {
		size: 15,
		angle: Math.PI / 1.2,
	},
};
const tmEdgeConfig = {
	arrows: {
		to: {
			enabled: true,
			scaleFactor: 0.3,
		},
	},
	length: 150,
	color: "#475569",
	font: {
		multi: "md",
		strokeWidth: 0,
		color: "#67E8F9",
		face: "Fira Code",
		background: "#27272A",
		size: 10,
	},
	selfReference: {
		size: 20,
		angle: Math.PI / 1.2,
		renderBehindTheNode: false,
	},
};

export { getNodeConfig, edgeConfig, tmEdgeConfig };
