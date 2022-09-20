export type DefaultPost = {
  id: number;
  comment: string;
  createdAt: Date;
  user: DefaultUser;
};

export type DefaultItem = {
  id: number;
  name: string;
  image: string | null;
  asin: string;
};

export type DefaultPostWithItem = DefaultPost & { item: DefaultItem };

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
