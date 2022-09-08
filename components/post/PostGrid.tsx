import { SimpleGrid } from "@chakra-ui/react";
import { FC } from "react";
import { DefaultPostFragment } from "~/lib/client/generated";
import { PostCard } from "./PostCard";

type Props = {
  posts: DefaultPostFragment[];
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
