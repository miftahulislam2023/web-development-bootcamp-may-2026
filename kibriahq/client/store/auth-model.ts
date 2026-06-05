import { action, persist, Action, computed } from "easy-peasy";

type User = Record<string, any>;

export type AuthModel = {
  user: User;
  isAuth: any;
  token: string | null;

  login: Action<AuthModel, {user: User, token: string}>;
  setUser: Action<AuthModel, User>;
  logout: Action<AuthModel, User>;
};

const authModel = persist<AuthModel>(
  {
    user: {},
    token: null,

    isAuth: computed((state: any) => !!state.token),

    login: action((state, user) => {
      state.user = user;
      state.token = user.token;
    }),

    setUser: action((state, user) => {
      state.user = {...state.user, ...user};
    }),

    logout: action((state) => {
      state.user = {};
      state.token = null;
    }),
  },
  {
    storage: "localStorage",
  },
);

export default authModel;
