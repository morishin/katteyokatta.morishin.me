import { type NextApiResponse } from "next";

export const revalidator = {
  onCreateOrUpdatePost: async (
    res: NextApiResponse,
    postUserName: string,
    postItemId: number
  ) => {
    return Promise.all([
      res.revalidate("/"),
      res.revalidate(`/items/${postItemId}`),
      // res.revalidate(`/${postUserName}`),
    ]);
  },
  onUpdateUserAssociateTag: async (res: NextApiResponse, userName: string) => {
    return Promise.all([
      res.revalidate("/"),
      // res.revalidate(`/${userName}`),
    ]);
  },
};
