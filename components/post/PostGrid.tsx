import { Grid } from "@chakra-ui/react";
import { FC } from "react";
import { PostCard } from "~/components/post/PostCard";
import { PostWithItem } from "~/lib/client/types/type";

type Props = {
  posts: PostWithItem[];
};

export const PostGrid: FC<Props> = ({ posts }) => {
  return (
    <Grid
      templateColumns="repeat(auto-fill, minmax(160px, 1fr));"
      gap="16px"
      justifyContent="center"
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Grid>
  );
};
