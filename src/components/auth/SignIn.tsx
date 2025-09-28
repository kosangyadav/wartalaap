import { useAction } from "convex/react";
import { useState } from "react";
import { useAuthStore } from "../../../stores/authStore";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router";

const SignIn = () => {
  // local states
  const [username, setUsername] = useState<null | string>(null);
  const [password, setPassword] = useState<null | string>(null);

  const navigate = useNavigate();

  // convex action
  const checkUserAuth = useAction(api.auth.checkUser);

  // zustand states
  const { setUser } = useAuthStore();

  const formHandler = async (e) => {
    e.preventDefault();
    console.log({ username, password });
    if (username == null || password == null) {
      console.log("please enter credentials...");
      return false;
    }

    console.log("logging the user : ", { username, password });
    const dbResponse = await checkUserAuth({ username, password });
    console.log(dbResponse);
    if (!dbResponse.success) {
      console.log(dbResponse.message);
      return dbResponse.success;
    }

    setUser({ id: dbResponse.userId, username, email: dbResponse.email });

    navigate("/chat");
    console.log("loggedIn, successfully...");
  };

  return (
    <div className=" min-w-screen min-h-screen font-sans flex items-center justify-center">
      <form
        onSubmit={formHandler}
        className="flex flex-col gap-2 border-2 rounded-2xl py-10 px-8 items-center"
      >
        Username
        <br />
        <br />
        <input
          className="text-center border-1 p-1 rounded-2xl"
          type="text"
          placeholder="enter username"
          value={username || ""}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <br />
        <br />
        Password
        <br />
        <br />
        <input
          className="text-center border-1 p-1 rounded-2xl"
          type="password"
          placeholder="enter password"
          value={password || ""}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <br /> <br />
        <button type="submit" className="border-2 p-2 rounded-2xl w-fit">
          Submit to me
        </button>
      </form>
    </div>
  );
};

export default SignIn;
