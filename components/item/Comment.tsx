import { Box, Button, HStack, Link as ChakraLink } from "@chakra-ui/react";
import { format, isThisYear } from "date-fns";
import { FC } from "react";
import { UserLink } from "~/components/UserLink";
import { DefaultPost } from "~/lib/client/types/type";

type CommentProps = {
  post: DefaultPost;
  isSelected: boolean;
  isEditable: boolean;
  onClickEdit?: () => void;
};

export const Comment: FC<CommentProps> = ({
  post,
  isSelected,
  isEditable,
  onClickEdit,
}) => {
  const commentDateText = format(
    post.createdAt,
    isThisYear(post.createdAt) ? "M月d日" : "yyyy年M月d日"
  );
  const backgroundColor = isSelected ? "#FFFCDF" : "white";
  return (
    <Box id={`comment-${post.id}`} marginBottom="18px">
      <HStack>
        <UserLink
          userName={post.user.name}
          userImage={post.user.image}
          size={30}
        />
        <HStack alignItems="baseline">
          <ChakraLink
            href={`#comment-${post.id}`}
            fontSize="xs"
            paddingTop="2px"
          >
            {commentDateText}
          </ChakraLink>
          {isEditable && (
            <Button
              color="inherit"
              fontWeight="normal"
              size="xs"
              onClick={onClickEdit}
              variant="link"
            >
              編集
            </Button>
          )}
        </HStack>
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
