export type TodoType = {
  id: number;
  content: string;
  isComplete: boolean;
}

export type CommentType = {
	id: number;
	content: string;
	author: string;
	userId: number;
	postId: number;
	createdAt: string;
};

export type PostType = {
	postType: string;
	title: string;
	author: string;
	userId: number;
	createdAt: string;
	content: string;
	comments: CommentType[];
};