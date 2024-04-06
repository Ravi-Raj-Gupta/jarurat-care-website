export const load = ({ params }: { params: { id: string } }) => {
	return {
		chatId: params.id
	};
};
