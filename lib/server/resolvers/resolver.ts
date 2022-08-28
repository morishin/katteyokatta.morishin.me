import { Resolvers, User } from "../generated/resolvers";
import { prisma } from "../prisma";

export const resolvers: Resolvers = {
  Query: {
    user: async (_parent, args, _context, _info) => getUser(args.id),
    allUsers: async (_parent, _args, _context, _info) => getAllUsers(),
  },
};

const getAllUsers = async (): Promise<User[]> => {
  return [];
  //   const users = await prisma.user.findMany({
  //     select: { providerAccountId: true, name: true, image: true },
  //   });
  //   return users.map((user) => ({
  //     id: user.providerAccountId,
  //     name: user.name,
  //     imageUrl: user.image,
  //   }));
};

const getUser = async (providerAccountId: string): Promise<User> => {
  return {} as User;
  // const user = await prisma.user.findUnique({
  //   where: { providerAccountId: providerAccountId },
  // });
  // if (user === null) throw new Error("User not found");
  // return {
  //   id: user.providerAccountId,
  //   name: user.name,
  //   imageUrl: user.image,
  // };
};
