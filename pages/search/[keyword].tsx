import type { NextPage } from "next";

import dynamic from "next/dynamic";

const ItemSearchResults = dynamic(
  () =>
    import("~/components/search/ItemSearchResults").then(
      ({ ItemSearchResults }) => ItemSearchResults
    ),
  {
    ssr: false,
  }
);

const ItemsSearchPage: NextPage = () => <ItemSearchResults />;

export default ItemsSearchPage;
