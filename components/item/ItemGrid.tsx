import { Grid } from "@chakra-ui/react";
import { FC } from "react";
import { ItemCard } from "~/components/item/ItemCard";
import { ItemWithPosts } from "~/lib/client/types/type";

type Props = {
  items: ItemWithPosts[];
};

export const ItemGrid: FC<Props> = ({ items }) => {
  return (
    <Grid templateColumns="repeat(auto-fit, 200px)" gap="16px">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </Grid>
  );
};
