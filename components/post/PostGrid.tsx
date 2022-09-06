import { SimpleGrid } from "@chakra-ui/react";
import { FC } from "react";
import { PostForTopPageFragment } from "~/lib/client/generated";
import { PostCard } from "./PostCard";

type Props = {
  posts: PostForTopPageFragment[];
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
