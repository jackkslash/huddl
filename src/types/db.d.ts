import type { Post, Huddl, User, Vote, Comment } from "@prisma/client";

export type ExtendedPost = Post & {
  huddl: Huddl;
  votes: Vote[];
  author: User;
  comments: Comment[];
};
