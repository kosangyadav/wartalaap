import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Link, useNavigate } from "react-router";
import { logout } from "./auth/logout";

const Navbar = () => {
  //local states
  const [openUserBox, setOpenUserBox] = useState<boolean>(false);

  const navigate = useNavigate();

  // zustand state
  const { user, isLoggedIn, removeUser } = useAuthStore();

  return (
    <header className={` flex justify-between items-center p-4 gap-4 w-full  `}>
      <h2 className="text-5xl font-extrabold">Wartalaap</h2>
      {isLoggedIn ? (
        <button
          className="border-1 py-2 px-4 rounded-full"
          onClick={() => setOpenUserBox((state) => !state)}
        >
          {user?.username.charAt(0).toUpperCase()}
        </button>
      ) : (
        <Link to={"/login"}>
          <button>Log In</button>
        </Link>
      )}
      {openUserBox && (
        <div className="absolute right-3 top-18 pt-3 bg-blue-800 rounded-2xl flex flex-col gap-2">
          <div className="px-3">
            <p>{user?.username}</p>
            <p>{user?.email}</p>
          </div>
          <button
            className="bg-red-600 rounded-b-2xl"
            onClick={() => logout(removeUser, navigate)}
          >
            logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
