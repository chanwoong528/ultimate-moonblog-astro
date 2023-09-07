//@ts-nocheck

import React from "react";
import { snsLoginGithub, snsLoginGoogle } from "../../common/utils/lib/FBAuth";
import { userInfo, patchUserInfo } from "../../common/store/storeUser";

const ListSNSLogin = () => {
  const SNS_LOGINS = [
    {
      id: "GOOGLE",
      label: "google",
      icon: "",
      onClick: async () => {
        const userData = await snsLoginGoogle();
        checkNewUser(userData);
      },
    },
    {
      id: "GITHUB",
      label: "github",
      icon: "",
      onClick: async () => {
        const userData = await snsLoginGithub();

        checkNewUser(userData);
      },
    },
  ];

  const checkNewUser = (userData) => {
    console.log(userData);
    if (userData.verified === "N") {
      //New User
      patchUserInfo(userData);
      window.location.href = "/auth/register";
    } else {
      //Existing User 
      patchUserInfo(userData);
    }
  };

  return (
    <ul>
      {SNS_LOGINS.map((sns) => {
        return (
          <li>
            <button onClick={sns.onClick}>{sns.label}</button>
          </li>
        );
      })}
    </ul>
  );
};

export default ListSNSLogin;
