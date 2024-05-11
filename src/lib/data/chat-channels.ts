export const chatChannels: { [key: string]: ChatChannelType } = {
	gallbladder: {
		id: 'gallbladder',
		name: 'Gallbladder Cancer',
		description: 'For patients with gallbladder cancer'
	},
	gallstone: {
		id: 'gallstone',
		name: 'Gallstone',
		description: 'Get help regarding Gallstone'
	},
	'talk-to-hope': {
		id: 'talk-to-hope',
		name: 'Talk to Hope',
		description: 'Your personal caregiver'
	},
};

export type ChatChannelType = {
	id: string;
	name: string;
	description?: string;
};
