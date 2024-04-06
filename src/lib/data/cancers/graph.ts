/**
 * create a graph for chat. each node should contain the next node and the
 * message to be displayed
 */

type ChatOption = {
	content: string;
	nextNode?: ChatGraph;
}

export type ChatGraph = {
	content: string;
	options: ChatOption[];
};
