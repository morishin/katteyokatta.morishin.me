import { SimpleGrid } from "@chakra-ui/react";
import { FC } from "react";
import { PostCard } from "~/components/post/PostCard";
import { PostWithItem } from "~/lib/client/types/type";

type Props = {
  posts: PostWithItem[];
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
