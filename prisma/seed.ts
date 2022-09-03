import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const provider = "twitter";
  const providerAccountId = "243660091";

  const user = await prisma.user.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      id: 1,
      name: "test-user-1",
      image: "https://g.morishin.me/icon.png",
    },
  });
  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
    update: {},
    create: {
      type: "oauth",
      provider,
      providerAccountId,
      refresh_token: "dummy",
      access_token: "dummy",
      expires_at: 1661660556,
      token_type: "bearer",
      userId: user.id,
    },
  });

  const items = [
    {
      asin: "B09RT1F3Z8",
      name: "ポッカサッポロ 北海道富良野ホップ炭酸水 500ml×24本",
      image: "https://m.media-amazon.com/images/I/41rXh6WnjNL._SL500_.jpg",
    },
    {
      asin: "B071FSPSYV",
      name: "Bauhutte ( バウヒュッテ ) 昇降式 L字デスク スタンダード BHD-670H-BK",
      image: "https://m.media-amazon.com/images/I/41tHKqXjWXL._SL500_.jpg",
    },
    {
      asin: "B07WH6JVRN",
      name: "骨伝導 ワイヤレス イヤホン Aftershokz アフターショックス AEROPEX Cosmic Black【AFT-EP-000011】国内正規品2年保証 マイク付き Bluetooth ブルートゥース",
      image: "https://m.media-amazon.com/images/I/31NsP61sGaL._SL500_.jpg",
    },
  ];
  await prisma.$transaction(
    items.map((item) =>
      prisma.item.upsert({
        where: {
          asin: item.asin,
        },
        update: {},
        create: item,
      })
    )
  );

  await prisma.post.deleteMany({});
  const allItems = await prisma.item.findMany({});
  await prisma.post.createMany({
    data: allItems
      .flatMap((_e, _i, x) => x)
      .flatMap((_e, _i, x) => x)
      .flatMap((_e, _i, x) => x)
      .map((item, index) => ({
        userId: user.id,
        itemId: item.id,
        comment: `${item.name}へのコメントです (${index})`,
      })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
