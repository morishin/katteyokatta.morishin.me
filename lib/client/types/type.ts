export type DefaultPost = {
  id: number;
  comment: string;
  createdAt: Date;
  user: {
    id: number;
    name: string;
    image: string | null;
    associateTag: string | null;
  };
  item: {
    id: number;
    name: string;
    image: string | null;
    asin: string;
  };
};

export type DefaultAmazonItem = {
  asin: string;
  name: string;
  image: string | null;
  amazonUrl: string;
  price: string;
};

export type DefaultUser = {
  id: number;
  name: string;
  image: string | null;
  associateTag: string | null;
};
