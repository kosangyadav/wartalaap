export const logout = async (
  removeUser: () => void,
  navigate: (path: string) => void,
) => {
  await removeUser();
  navigate("/login");
};
