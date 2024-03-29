import { Heading, HStack } from "@chakra-ui/react";
import type { FC } from "react";
import { DefaultItem } from "~/lib/client/types/type";
import { SimilarItemCard } from "./SimilarItemCard";

type SimilarItemsSectionProps = {
  similarities: DefaultItem["similarities"];
};

export const SimilarItemsSection: FC<SimilarItemsSectionProps> = ({
  similarities,
}) => {
  const items = similarities.map((item) => item.targetItem);
  return (
    <div>
      <Heading
        as="h2"
        fontSize="xl"
        fontWeight="normal"
        marginTop="24px"
        marginBottom="16px"
      >
        似ているもの
      </Heading>
      <HStack overflowX="auto" spacing="5px" alignItems="flex-start">
        {items.map((item) => (
          <SimilarItemCard key={item.id} item={item} />
        ))}
      </HStack>
    </div>
  );
};
