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
