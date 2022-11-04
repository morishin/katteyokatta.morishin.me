import { prisma } from "../server/prisma";
import { calculateItemSimilarityScore } from "./calculateItemSimilarityScore";

const SCORE_THRESHOLD = 0.2;

export const updateItemSimilarityScores = async () => {
  // 類似度が計算済みでない item を全て取得
  const itemsWithoutScores = await prisma.item.findMany({
    where: {
      similarityCalculation: null,
    },
  });

  const allItems = await prisma.item.findMany();

  for (const item of itemsWithoutScores) {
    const targetItems = allItems.filter(({ id }) => id !== item.id);
    const itemSimilarities = targetItems.map((targetItem) => {
      const score = calculateItemSimilarityScore(item, targetItem);
      return {
        itemId: item.id,
        targetItemId: targetItem.id,
        score,
      };
    });

    // 閾値を超えた類似度についてレコードを生成する
    const newItemSimilarities = itemSimilarities.filter(
      ({ score }) => score > SCORE_THRESHOLD
    );
    const createItemSimilarities = prisma.itemSimilarity.createMany({
      data: newItemSimilarities,
      skipDuplicates: true,
    });

    // 逆方向の類似度レコードも生成する
    const invertedNewItemSimilarities = newItemSimilarities.map(
      ({ itemId, targetItemId, score }) => ({
        itemId: targetItemId,
        targetItemId: itemId,
        score,
      })
    );
    const createInvertedItemSimilarities = prisma.itemSimilarity.createMany({
      data: invertedNewItemSimilarities,
      skipDuplicates: true,
    });

    // 対象の item について類似度が計算済みであることをマークする
    const createItemSimilarityCalculation =
      prisma.itemSimilarityCalculation.create({
        data: {
          itemId: item.id,
        },
      });

    await prisma.$transaction([
      createItemSimilarities,
      createItemSimilarityCalculation,
      createInvertedItemSimilarities,
    ]);
  }
};
