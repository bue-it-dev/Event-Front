import { atom } from "recoil";

export const userAtom = atom({
  key: "user",
  default: {
    loggedIn: false,
    type: null,
    id: null,
  },
});
