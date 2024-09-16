import UserService, {
  CreateUserPayload,
  GetUserTokenPayload,
} from "../../services/user";

const queries = {
  getUserToken: async (_: any, paylaod: GetUserTokenPayload) => {
    const token = await UserService.getUserToken(paylaod);
    return token;
  },
  getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
    if (context && context.user) {
      const user = await UserService.getUserById(context.user.id);
      return user;
    }
    throw new Error("I dont know Who are you");
  },
};

const mutations = {
  createUser: async (_: any, paylaod: CreateUserPayload) => {
    const res = await UserService.createuser(paylaod);
    return res.id;
  },
};

export const resolvers = { queries, mutations };
