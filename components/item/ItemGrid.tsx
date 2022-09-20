import { SimpleGrid } from "@chakra-ui/react";
import { FC } from "react";
import { ItemCard } from "~/components/item/ItemCard";
import { ItemWithPosts } from "~/lib/client/types/type";

type Props = {
  items: ItemWithPosts[];
};

export const ItemGrid: FC<Props> = ({ items }) => {
  return (
    <SimpleGrid minChildWidth="200px" spacing="10px">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </SimpleGrid>
  );
};
