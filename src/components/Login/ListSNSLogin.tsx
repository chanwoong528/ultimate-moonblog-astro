//@ts-nocheck

import React from "react";
import { snsLoginGithub, snsLoginGoogle } from "../../common/utils/lib/FBAuth";
import { patchUserInfo } from "../../common/store/storeUser";

const ListSNSLogin = () => {
  const SNS_LOGINS = [
    {
      id: "GOOGLE",
      label: "google",
      icon: "",
      onClick: async () => {
        const userData = await snsLoginGoogle();

        checkNewUser(userData.data);
      },
    },
    {
      id: "GITHUB",
      label: "github",
      icon: "",
      onClick: async () => {
        const userData = await snsLoginGithub();

        checkNewUser(userData.data);
      },
    },
  ];

  const checkNewUser = (userData) => {
    if (userData.verified === "N") {
      //New User
      patchUserInfo(userData);
      window.location.href = "/auth/register";
    } else {
      //Existing User
      patchUserInfo(userData);
      window.location.href = "/";
    }
  };

  return (
    <ul>
      {SNS_LOGINS.map((sns) => {
        return (
          <li key={sns.id}>
            <button onClick={sns.onClick}>{sns.label}</button>
          </li>
        );
      })}
    </ul>
  );
};

export default ListSNSLogin;
