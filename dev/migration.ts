import { PrismaClient } from "@prisma/client";
import { Client } from "pg";
import { updateItemSimilarityScores } from "~/lib/itemSimilarity/updateItemSimilarityScores";

const prisma = new PrismaClient();
const pgClient = new Client({
  connectionString: process.env.OLD_DATABASE_URL, // Heroku DB URL
  ssl: {
    rejectUnauthorized: false,
  },
});

type PgUser = {
  id: string;
  provider: string;
  provider_uid: string;
  name: string;
  icon_url: string | null;
  associate_tag: string | null;
  created_at: Date;
  updated_at: Date;
};

type PgItem = {
  id: string;
  asin: string;
  name: string;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
};

type PgPost = {
  id: string;
  user_id: string;
  item_id: string;
  comment: string;
};

async function reset() {
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.post.deleteMany();
  await prisma.itemSimilarity.deleteMany();
  await prisma.itemSimilarityCalculation.deleteMany();
  await prisma.item.deleteMany();
}

async function main() {
  await reset();

  await pgClient.connect();
  const pgUsers = await pgClient.query<PgUser>(
    "select * from users order by id asc;"
  );
  for (const pgUser of pgUsers.rows) {
    await prisma.user.create({
      data: {
        id: Number(pgUser.id),
        name: pgUser.name,
        image: pgUser.icon_url,
        associateTag: pgUser.associate_tag,
        createdAt: pgUser.created_at,
        updatedAt: pgUser.updated_at,
        accounts: {
          create: {
            type: "oauth",
            provider: pgUser.provider,
            providerAccountId: pgUser.provider_uid,
          },
        },
      },
    });
  }

  const pgItems = await pgClient.query<PgItem>(
    "select * from items order by id asc;"
  );
  await prisma.item.createMany({
    data: pgItems.rows.map((pgItem) => ({
      id: Number(pgItem.id),
      asin: pgItem.asin,
      name: pgItem.name,
      image: pgItem.image_url,
      createdAt: pgItem.created_at,
      updatedAt: pgItem.updated_at,
    })),
  });

  const pgPosts = await pgClient.query<PgPost>(
    "select * from posts order by id asc;"
  );
  await prisma.post.createMany({
    data: pgPosts.rows.map((pgPost) => ({
      id: Number(pgPost.id),
      userId: Number(pgPost.user_id),
      itemId: Number(pgPost.item_id),
      comment: pgPost.comment,
    })),
  });

  await updateItemSimilarityScores();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pgClient.end();
    console.log("✅ Done");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pgClient.end();
    process.exit(1);
  });
