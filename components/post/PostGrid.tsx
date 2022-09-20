import { SimpleGrid } from "@chakra-ui/react";
import { FC } from "react";
import { DefaultPostWithItem } from "~/lib/client/types/Post";
import { PostCard } from "./PostCard";

type Props = {
  posts: DefaultPostWithItem[];
};

export const PostGrid: FC<Props> = ({ posts }) => {
  return (
    <SimpleGrid minChildWidth="200px" spacing="10px">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </SimpleGrid>
  );
};
