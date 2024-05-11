import Brain from '$lib/components/svg/brain.svelte';
import Diagnoses from '$lib/components/svg/diagnoses.svelte';
import Social from '$lib/components/svg/social.svelte';
import Salad from '$lib/components/svg/salad.svelte';
import Heal from '$lib/components/svg/heal.svelte';

export const solutions = [
	{
		id: 'Treatment Plan Navigation',
		icon: Brain,
		title: 'Treatment Care Think Tank: Personalized Cancer Support',
		description:
			`Our expert team of oncologists, officials, nutritionists, and spiritual guides collaborate to create individualized care plans tailored to each patient's unique needs.,

Experience the difference of compassionate, holistic cancer support.`,
	},
	{
		icon: Diagnoses,
		title: 'CancerConnect',
		description:
			'A community of dedicated caregivers who will help you navigate in your uncertain time and assist with on ground clinical visits & other medical requirements.'
	},
	{
		icon: Social,
		title: 'Introducing EdTech & Social Box:\n\nYour All-in-One Patient Support Platform',
		description:
			'Connect with fellow patients, caregivers, and medical experts through our interactive online community. Request assistance, share updates, raise awareness, and access a wealth of educational resources - all in one convenient place.'
	},
	{
		icon: Salad,
		title: 'Nutritional & Emotional Well-being: Nurturing Body and Soul',
		description:
			`We provide personalized nutritional plans tailored to your unique needs, ensuring you receive the right nutrients to support healing and well-being.

Our compassionate team also guides you through emotional challenges, offering unwavering support.
			
Experience the transformative power of holistic care for body and soul at Jarurat Care.
			`
	},
	{
		icon: Heal,
		title: 'HealBlog: Uplifting Stories, Unbreakable Spirit',
		description:
			`Discover inspiring survivor stories that empower and keep your spirits high on your cancer journey.

Read, watch, and listen to heartfelt accounts of strength and healing. Find comfort and hope in our community of survivors, patients, and supporters.
		
Visit HealBlog today – let these stories guide your path to healing.`
	},
	// {
	// 	icon: Stretcher,
	// 	title: 'Emergency Response System',
	// 	description:
	// 		'ERS to handle critical situations promptly involving a dedicated hotline or WhatsApp/Telegram groups that allows patients or their families to request urgent assistance from caregivers in their area.'
	// },
	// 	{
	// 		icon: Cancer,
	// 		title: 'Community Outreach: Spreading Hope, Connecting Communities',
	// 		description:
	// 			`Our awareness campaigns reach those in need, inviting them to our supportive network. We showcase our comprehensive services and share inspiring survivor stories to keep spirits high.

	// Join us in spreading hope and making a difference in the lives of those affected by rare cancers. Get involved today!`
	// 	},
	// {
	// 	icon: Microscope,
	// 	title: 'Research & Development',
	// 	description:
	// 		'Invest in ongoing research to keep the educational toolbox up-to-date with the latest medical information. This will ensure that patients and caregivers have access to accurate and reliable resources.'
	// }
];
