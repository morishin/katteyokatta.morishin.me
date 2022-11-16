import { type NextApiResponse } from "next";

export const revalidator = {
  onCreateOrUpdatePost: async (
    res: NextApiResponse,
    postUserName: string,
    postItemId: number
  ) => {
    return Promise.all([
      res.revalidate("/_dev"),
      // res.revalidate(`/${postUserName}`),
      // res.revalidate(`/items/${postItemId}`),
    ]);
  },
  onUpdateUserAssociateTag: async (res: NextApiResponse, userName: string) => {
    return Promise.all([
      res.revalidate("/_dev"),
      // res.revalidate(`/${userName}`),
    ]);
  },
};
