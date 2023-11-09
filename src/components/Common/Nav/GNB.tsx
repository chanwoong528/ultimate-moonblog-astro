import React, { useEffect } from "react";
import { userInfo } from "../../../common/store/storeUser";
import { checkLoginUser } from "../../../http/auth/ApiUser";
import { NAV_LIST } from "../../../common/utils/constant/CONSTANT";
const GNB = () => {
  useEffect(() => {
    checkLoginUser();
  }, []);

  return (
    <nav className="gnb">
      <ul>
        {NAV_LIST
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
