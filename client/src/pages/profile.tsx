import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useParams } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Dot } from "lucide-react";
import { ProfileSubCard } from "../components";

const Profile = () => {
  const { userId } = useParams();
  const username = "striver";
  const isAdmin = true;
  return (
    <>
      <div className="w-full h-full flex items-center justify-center space-x-5 ">
        <Card className=" bg-white border-2 border-slate-600 h-[35rem] w-[40rem] shadow-md shadow-black dark:shadow-white ">
          <CardTitle className="font-[anzo2] text-2xl text-center">
            {"Profile"}
          </CardTitle>
          <CardHeader>
            <div className="relative bg-black rounded-2xl py-2 w-1/2 mx-auto shadow-md shadow-black">
              {isAdmin && (
                <>
                  <Badge className=" hover:text-white dark:hover:text-black absolute scale-90 right-2 shadow-sm shadow-black bg-white/50 text-black ">
                    <Dot className="-mx-1" />
                    {"Admin"}
                    <Dot className="-mx-1"/>
                  </Badge>
                </>
              )}

              <Avatar className="w-20 h-auto mx-auto border-2 border-white">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt={username || "@kitabe"}
                />
                <AvatarFallback>{username || "Kitabe"}</AvatarFallback>
              </Avatar>
              <h1 className="text-center font-[anzo2] text-white">
                {"@striver"}
              </h1>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <ProfileSubCard/>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        <Card className="bg-white h-[35rem] w-[30rem] border-2 border-slate-600 shadow-md shadow-black dark:shadow-white ">
          <CardTitle className="font-[anzo2] text-2xl text-center">
            {"Portfolio"}
          </CardTitle>
          <CardHeader>
            <div className=""></div>
            <h1></h1>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Profile;
