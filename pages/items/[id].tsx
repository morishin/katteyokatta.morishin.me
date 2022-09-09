import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { makeGetServerSidePropsWithSession } from "~/lib/server/auth/withSession";
import { prisma } from "~/lib/server/prisma";

type ItemPageProps = {
  item: {
    id: number;
    createdAt: Date;
    name: string;
    image: string | null;
    asin: string;
    posts: {
      user: {
        id: number;
        name: string;
        image: string | null;
        associateTag: string | null;
      };
      id: number;
      comment: string;
      createdAt: Date;
    }[];
  };
};

export const getServerSideProps: GetServerSideProps<ItemPageProps> =
  makeGetServerSidePropsWithSession<ItemPageProps>(
    async (context, _session) => {
      const { params } = context;
      const itemId = Number(params?.["id"]);
      if (typeof itemId !== "string") throw new Error("Invalid params");

      const item = await prisma.item.findFirst({
        where: {
          id: itemId,
        },
        select: {
          id: true,
          asin: true,
          name: true,
          image: true,
          createdAt: true,
          posts: {
            select: {
              id: true,
              comment: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  associateTag: true,
                },
              },
            },
          },
        },
      });
      if (!item) return { notFound: true };

      return {
        props: {
          item,
        },
      };
    }
  );

const ItemPage: NextPage<ItemPageProps> = ({ item }) => {
  return (
    <div>
      <Head>
        <title>買ってよかったもの</title>
      </Head>
    </div>
  );
};

export default ItemPage;
