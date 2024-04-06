import { type ChatGraph } from './graph';

export const boneCancerGraph: ChatGraph = {
	content:
		'Bone cancer is a rare type of cancer that can affect any bone in the body. It most commonly occurs in the long bones of the arms and legs. What would you like to know about bone cancer?',
	options: [
		{
			content: 'Yes',
			nextNode: {
				content: 'do you have any symptoms?',
				options: [
					{
						content: 'Yes',
						nextNode: {
							content:
								'Common symptoms of bone cancer include: - Bone pain that gets worse at night or with activity - Swelling around the affected bone - A lump near the affected bone - Fractures or breaks in the bone - Fatigue - Unintended weight loss - Fever - Anemia (low red blood cell count) If you are experiencing any of these symptoms, it is important to see a doctor for further evaluation.',
							options: [{ content: 'Ok', nextNode: undefined }]
						}
					},
					{ content: 'No', nextNode: undefined }
				]
			}
		},
		{ content: 'No', nextNode: undefined }
	]
};
