import { Grid } from "@chakra-ui/react";
import type { FC } from "react";
import { PostCard } from "~/components/post/PostCard";
import { PostWithItem } from "~/lib/client/types/type";

type Props = {
  posts: PostWithItem[];
};

const NUM_EAGER_LOADING_IMG = 6;

export const PostGrid: FC<Props> = ({ posts }) => {
  return (
    <Grid
      templateColumns="repeat(auto-fill, minmax(160px, 1fr));"
      gap={["8px", "8px", "16px", "16px"]}
      justifyContent="center"
    >
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          eagerLoadImage={index < NUM_EAGER_LOADING_IMG}
        />
      ))}
    </Grid>
  );
};
