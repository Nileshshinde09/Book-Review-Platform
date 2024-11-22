import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { buttonVariants } from "./ui/button";
import {
  AlignJustify,
  House,
  BookText,
  LayoutDashboard,  
  Filter,
} from "lucide-react";
import { Input } from "./ui/input";
const authStatus = true;
const isAdmin = true;
const _NavigationMenu = () => {
  const router = useNavigate();
  return (
    <div className="absolute dark:shadow-white  left-0 right-0 w-[96%] mx-auto mt-2 h-12 bg-white/5 backdrop-blur-sm shadow-sm shadow-black border-spacing-2 rounded-lg flex justify-between p-1 space-x-2">
      <img
        src={"/kitabe-logo2.png"}
        className="object-contain h-auto cursor-pointer"
        alt="app-logo"
        onClick={() => router("/")}
      />
      {authStatus && (
        <div className="max-md:hidden">
          <Link
            to={"#"}
            className={buttonVariants({
              variant: "link",
              className:
                "hover:scale-105 transition-transform font-[anzo4] sm:text-2xl text-xl",
            })}
          >
            Home
          </Link>
          <Link
            to={"#"}
            className={buttonVariants({
              variant: "link",
              className:
                "hover:scale-105 transition-transform font-[anzo4] sm:text-2xl text-xl",
            })}
          >
            FindMyBook
          </Link>
          {isAdmin && (
            <Link
              to={"#"}
              className={buttonVariants({
                variant: "link",
                className:
                  "hover:scale-105 transition-transform font-[anzo4] sm:text-2xl text-xl",
              })}
            >
              Dashboard
            </Link>
          )}
        </div>
      )}
      <div className="w-fit flex space-x-2">
        {authStatus && (
          <div className="max-sm:hidden flex space-x-2 items-center">
            <Input
              className="w-[15rem] text-black dark:text-white shadow-sm shadow-black"
              placeholder="search"
            />
            <Filter className="cursor-pointer" />
          </div>
        )}
        <AlignJustify className="md:hidden transition-all self-center" />
        <ul className="">
          {authStatus ? (
            <Link
              to={"#"}
              className={buttonVariants({
                variant: "outline",
              })}
            >
              Logout
            </Link>
          ) : (
            <Link
              to={"#"}
              className={buttonVariants({
                variant: "outline",
              })}
            >
              Login
            </Link>
          )}{" "}
        </ul>
        <ul className="justify-self-end">
          <ModeToggle />
        </ul>
      </div>
    </div>
  );
};

export default _NavigationMenu;
