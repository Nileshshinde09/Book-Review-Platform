import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../providers/theme-provider";

const AuthLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.ReactNode => {
  const currentTheme = useTheme();
  const [logo, setLogo] = useState<string>("");
  useEffect(() => {
    if (currentTheme.theme === "dark") {
      setLogo("/kitabe-logo1.png");
      return;
    } else if (currentTheme.theme === "light") {
      setLogo("/kitabe-logo2.png");
      return;
    }else{
      setLogo("/kitabe-logo3.png")
    }
  }, [currentTheme]);
  return (
    <div
      className={cn(
        `
        md:grid grid-cols-2 gap-4 mx-10 
    `,
        className
      )}
    >
      <div className="max-md:hidden mt-[5rem]">
        <img
          src={"/book-img.png"}
          className="w-[40rem] md:mt-20 lg:mt-14 drop-shadow-2xl shadow-red-600"
        />
      </div>
      <div className="overflow-y-scroll pt-[5rem] h-screen pb-[7rem] no-scrollbar">
        <img src={logo} className="w-[14rem] mx-auto" />
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;