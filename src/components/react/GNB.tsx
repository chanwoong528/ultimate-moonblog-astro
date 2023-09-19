import React, { useRef, useEffect } from "react";
import { userInfo } from "../../common/store/storeUser";
import { checkLoginUser } from "../../http/auth/ApiUser";

const GNB = () => {
  const navItem = useRef([
    { title: "About", url: "/", auth: 2 },
    { title: "Project", url: "/projects", auth: 2 },
    { title: "Posts", url: "/posts", auth: 2 },
    { title: "Guestbook", url: "/guestbook", auth: 2 },
    { title: "Admin", url: "/admin", auth: 3 },
    { title: "Login", url: "/auth", auth: 0 },
    // { title: "Register", url: "/auth/register", order: 6 },
  ]);
  useEffect(() => {
    checkLoginUser();
  }, []);

  return (
    <nav className="gnb">
      <ul>
        {navItem.current
          .filter((item) =>
            !userInfo.get().id
              ? item.auth > -1 && item.auth < 3
              : userInfo.get().role === "admin"
              ? item.auth > 1
              : item.auth > 1 && item.auth < 3
          )
          .map((item) => (
            <li key={item.title}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
      </ul>
    </nav>
  );
};

export default GNB;
