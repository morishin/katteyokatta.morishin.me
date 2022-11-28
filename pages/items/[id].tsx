import { Heading, HStack, Spacer, Text, VStack } from "@chakra-ui/react";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { createContext, useEffect, useState } from "react";
import superjson from "superjson";
import { Comment } from "~/components/item/Comment";
import { SimilarItemsSection } from "~/components/item/SimilarItemsSection";
import { Container } from "~/components/layouts/Container";
import { Meta } from "~/components/Meta";
import { PlaceholderImage } from "~/components/PlaceholderImage";
import { AmazonButton } from "~/components/post/AmazonButton";
import { TweetButton } from "~/components/TweetButton";
import { WEB_HOST } from "~/lib/client/constants";
import { usePostEdit } from "~/lib/client/post/usePostEdit";
import { trpcNext } from "~/lib/client/trpc/trpcNext";
import { AppRouter, appRouter } from "~/lib/server/trpc/routers/appRouter";

const PostEditModal = dynamic(
  () =>
    import("~/components/post/PostEditModal").then(
      ({ PostEditModal }) => PostEditModal
    ),
  {
    ssr: false,
  }
);

type Props = {
  itemId: number;
  pageUrl: string;
};

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { params } = context;
  const itemId = Number(params?.["id"]);
  if (isNaN(itemId)) return { notFound: true };

  const pageUrl = `${WEB_HOST}/items/${itemId}`;
  const ssg = createProxySSGHelpers<AppRouter>({
    router: appRouter,
    ctx: createContext as any,
    transformer: superjson,
  });

  const result = await ssg.item.single.fetch({ id: itemId });
  if (result === null) return { notFound: true };

  const props = {
    trpcState: ssg.dehydrate(),
    itemId,
    pageUrl,
  };
  return { props };
};

const ItemPage: NextPage<Props> = ({ itemId, pageUrl }) => {
  const { data: session } = useSession();

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
        {item.image ? (
          <Image
            loading="eager"
            src={item.image}
            alt=""
            width="200"
            height="200"
            style={{
              objectFit: "contain",
              width: "200px",
              height: "200px",
            }}
          />
        ) : (
          <PlaceholderImage width="200px" height="200px" />
        )}
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
