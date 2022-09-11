import { Box, HStack, Link as ChakraLink } from "@chakra-ui/react";
import { format, isThisYear, parseISO } from "date-fns";
import { useRouter } from "next/router";
import { FC } from "react";
import { UserLink } from "../UserLink";

type CommentProps = {
  post: {
    user: {
      id: number;
      name: string;
      image?: string | null;
    };
    id: number;
    comment: string;
    createdAt: string;
  };
};

export const Comment: FC<CommentProps> = ({ post }) => {
  const router = useRouter();
  const commentDate = parseISO(post.createdAt);
  const commentDateText = format(
    commentDate,
    isThisYear(commentDate) ? "M月d日" : "yyyy年M月d日"
  );
  const isSelected = false;
  const backgroundColor = isSelected ? "#FFFCDF" : "white";
  return (
    <Box id={`comment-${post.id}`} marginBottom="18px">
      <HStack>
        <UserLink
          userName={post.user.name}
          userImage={post.user.image}
          size={30}
        />
        <ChakraLink href={`#comment-${post.id}`} fontSize="xs" paddingTop="2px">
          {commentDateText}
        </ChakraLink>
      </HStack>
      <Box
        borderBottom={`10px solid ${backgroundColor}`}
        marginTop="5px"
        marginLeft="10px"
        width="5px"
        borderX="5px solid transparent"
      />
      <Box backgroundColor={backgroundColor} padding="18px" borderRadius="8px">
        {post.comment}
      </Box>
    </Box>
  );
};
