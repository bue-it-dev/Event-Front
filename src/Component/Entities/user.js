export const initialState = {
  loggedIn: false,
  // type: type,
  // name: name,
  // student: {},
  // applicant: {}
};

export const setUser = user => newUser => {
  user.setState(newUser);
};
