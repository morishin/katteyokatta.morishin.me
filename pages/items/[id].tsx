import { Heading, HStack, Img, Spacer, Text, VStack } from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useLocation } from "react-use";
import { Comment } from "~/components/item/Comment";
import { SimilarItemsSection } from "~/components/item/SimilarItemsSection";
import { Container } from "~/components/layouts/Container";
import { Meta } from "~/components/Meta";
import { AmazonButton } from "~/components/post/AmazonButton";
import { TweetButton } from "~/components/TweetButton";
import { usePostEdit } from "~/lib/client/post/usePostEdit";
import { trpcNext } from "~/lib/client/trpc/trpcNext";
import { makeGetServerSideProps } from "~/lib/server/ssr/makeGetServerSideProps";
const PostEditModal = dynamic(
  () =>
    import("~/components/post/PostEditModal").then(
      ({ PostEditModal }) => PostEditModal
    ),
  {
    ssr: false,
  }
);

type ItemPageProps = {
  itemId: number;
  url: string | null;
};

export const getServerSideProps: GetServerSideProps<ItemPageProps> =
  makeGetServerSideProps<ItemPageProps>(async (context, { ssg, url }) => {
    const { params } = context;
    const itemId = Number(params?.["id"]);
    if (isNaN(itemId)) return { notFound: true };

    const result = await ssg.item.single.fetch({ id: itemId });
    if (result === null) return { notFound: true };

    return {
      props: {
        trpcState: ssg.dehydrate(),
        itemId,
        url,
      },
    };
  });

const ItemPage: NextPage<ItemPageProps> = ({ itemId, url }) => {
  const { data: session } = useSession();
  const { href } = useLocation();
  const pageUrl = href ?? url;

  const { data: item, refetch } = trpcNext.item.single.useQuery({ id: itemId });
  if (!item) {
    throw new Error("item is null");
  }

  // アンカーで指定されたコメントをハイライト表示する
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  useEffect(() => {
    setSelectedPostId(
      Number(window.location.hash.replace("#comment-", "")) || null
    );
  }, []);
  useEffect(() => {
    const onHashChange = () => {
      setSelectedPostId(
        Number(window.location.hash.replace("#comment-", "")) || null
      );
    };

    window.addEventListener("hashchange", onHashChange, false);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  // 投稿編集モーダル
  const onUpdateOrDeletePost = () => {
    refetch();
  };
  const {
    isOpenPostEditModal,
    openPostEditModal,
    editingPost,
    setEditingPost,
    onUpdatePost,
    onDeletePost,
    closePostEditModal,
  } = usePostEdit({ onUpdateOrDeletePost });

  return (
    <Container>
      <Meta
        title={item.name}
        ogUrl={pageUrl}
        ogImage={item.image ?? undefined}
      />
      <HStack justifyContent="flex-end" marginBottom="10px">
        <TweetButton url={pageUrl} />
      </HStack>
      <VStack
        alignItems="center"
        borderRadius="6px"
        bg="white"
        boxShadow="0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)"
        maxWidth="480px"
        padding="24px"
        marginX="auto"
      >
        <Img src={item.image || undefined} maxHeight="200px" marginX="auto" />
        <Text fontWeight="bold" fontSize="sm" wordBreak="break-all">
          {item.name}
        </Text>
        <Spacer h="10px" />
        <AmazonButton
          asin={item.asin}
          associateTag={
            item.posts.length === 1
              ? item.posts[0].user.associateTag ?? undefined
              : undefined
          }
          type="large"
        />
      </VStack>
      {item.similarities.length > 0 ? (
        <SimilarItemsSection similarities={item.similarities} />
      ) : null}
      <Heading
        as="h2"
        fontSize="xl"
        fontWeight="normal"
        marginTop="24px"
        marginBottom="16px"
      >
        これを買ってよかったと言っている人
      </Heading>
      <div>
        {item.posts.map((post) => {
          const isEditable = session?.user.id === post.user.id;
          const onClickEdit = () => {
            setEditingPost(post);
            openPostEditModal();
          };
          return (
            <Comment
              key={post.id}
              post={post}
              isSelected={selectedPostId === post.id}
              isEditable={isEditable}
              onClickEdit={isEditable ? onClickEdit : undefined}
            />
          );
        })}
      </div>

      {editingPost !== null && isOpenPostEditModal && (
        <PostEditModal
          post={editingPost}
          isOpen={isOpenPostEditModal}
          handleClose={closePostEditModal}
          onUpdate={onUpdatePost}
          onDelete={onDeletePost}
        />
      )}
    </Container>
  );
};

export default ItemPage;
