import UserService, { CreateUserPayload } from "../../services/user";

const queries = {};

const mutations = {
  createUser: async (_: any, paylaod: CreateUserPayload) => {
    const res = await UserService.createuser(paylaod);
    return res.id;
  },
};

export const resolvers = { queries, mutations };
