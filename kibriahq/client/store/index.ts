import { createStore } from "easy-peasy";
import authModel, { AuthModel } from "./auth-model";

export type Store = {
    auth: AuthModel
}

const store = createStore<Store>({
    auth: authModel
})

export default store;