import Brain from '$lib/components/svg/brain.svelte';
import Diagnoses from '$lib/components/svg/diagnoses.svelte';
import Social from '$lib/components/svg/social.svelte';
import Salad from '$lib/components/svg/salad.svelte';
import Heal from '$lib/components/svg/heal.svelte';
import Stretcher from '$lib/components/svg/stretcher.svelte';
import Microscope from '$lib/components/svg/microscope.svelte';
import Cancer from '$lib/components/svg/cancer.svelte';

export const solutions = [
	{
		id: 'Treatment Plan Navigation',
		icon: Brain,
		title: 'Treatment Care Think Tank!',
		description:
			'A team of exceptional oncologists, government officials, nutritionists and spiritual gurus to review individual cases in order to provide personalized care for each patient.'
	},
	{
		id: 'CancerConnect',
		icon: Diagnoses,
		title: 'CancerConnect',
		description:
			'A community of dedicated caregivers who will help you navigate in your uncertain time and assist with on ground clinical visits & other medical requirements.'
	},
	{
		id: 'EdTech & Social Box',
		icon: Social,
		title: 'EdTech & Social Box',
		description:
			'An interactive online platform that connects patients, caregivers and medical professionals used for requesting assistance, providing updates, raising awareness and accessing the educational toolbox.'
	},
	{
		id: 'Nutritional & Emotional Well-being',
		icon: Salad,
		title: 'Nutritional & Emotional Well-being',
		description:
			'Emphasis on the importance of nutrition via sharing a curated nutritional support plan for each patient based on their needs and active symptoms.'
	},
	{
		id: 'ConnectToHeal',
		icon: Heal,
		title: 'ConnectToHeal',
		description:
			'A personal blog & content channel to share surviors stories to keep patients moral high.'
	},
	{
		id: 'Emergency Response System',
		icon: Stretcher,
		title: 'Emergency Response System',
		description:
			'ERS to handle critical situations promptly involving a dedicated hotline or WhatsApp/Telegram groups that allows patients or their families to request urgent assistance from caregivers in their area.'
	},
	{
		id: 'Community Outreach and Awareness',
		icon: Cancer,
		title: 'Community Outreach and Awareness',
		description:
			'Conduct awareness campaigns in communities to promote our services and encourage more people to join our community . Sharing survivors stories to keep patients moral high.'
	},
	{
		id: 'Research & Development',
		icon: Microscope,
		title: 'Research & Development',
		description:
			'Invest in ongoing research to keep the educational toolbox up-to-date with the latest medical information. This will ensure that patients and caregivers have access to accurate and reliable resources.'
	}
];
