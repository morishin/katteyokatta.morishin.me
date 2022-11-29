import type { GetStaticProps, NextPage } from "next";
import { ItemSearchResults } from "~/components/search/ItemSearchResults";

export const getStaticProps: GetStaticProps = async (_context) => {
  return { props: {} };
};

const ItemsSearchPage: NextPage = () => <ItemSearchResults />;

export default ItemsSearchPage;
