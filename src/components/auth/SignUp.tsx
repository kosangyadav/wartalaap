import { useState } from "react";

import { api } from "../../../convex/_generated/api";
import { useAction, useMutation } from "convex/react";

import { useAuthStore } from "../../../stores/authStore.ts";

import { useNavigate } from "react-router";

const SignUp = () => {
  // local states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState<null | string>(null);
  const [password, setPassword] = useState<null | string>(null);

  const navigate = useNavigate();

  // convex action, query and mutation
  const checkUserExists = useAction(api.auth.checkUser);
  const createUser = useMutation(api.auth.createUser);

  // zustand states
  const { setUser } = useAuthStore();

  const formHandler = async (e) => {
    e.preventDefault();

    if (email == null || password == null) {
      console.log("please enter credentials...");
      return false;
    }

    console.log("logging the user : ", { username, email, password });
    const dbResponse = await checkUserExists({ username, action: "signup" });
    console.log(dbResponse);
    if (!dbResponse.success) {
      console.log(dbResponse.message);
      return dbResponse.success;
    }

    const ID = await createUser({ username, email, password });
    console.log(ID);

    setUser({ id: ID, username, email });

    navigate("/chat");
    console.log("loggedIn, successfully...");
  };

  return (
    <div className=" min-w-screen min-h-screen font-sans flex items-center justify-center p-8 pb-20 gap-16 sm:p-20">
      <form
        onSubmit={formHandler}
        className="flex flex-col gap-2 border-2 rounded-2xl py-10 px-8 items-center"
      >
        Username : <br />
        <input
          type="text"
          placeholder="enter username"
          value={username || ""}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <br />
        <br />
        Email : <br />
        <input
          type="email"
          placeholder="enter email"
          value={email || ""}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <br />
        <br />
        Password : <br />
        <input
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

export default SignUp;
