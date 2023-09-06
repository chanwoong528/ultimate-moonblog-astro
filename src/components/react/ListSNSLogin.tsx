//@ts-nocheck

import React from "react";
import { snsLoginGithub, snsLoginGoogle } from "../../common/utils/lib/FBAuth";

const ListSNSLogin = () => {
  const SNS_LOGINS = [
    {
      id: "GOOGLE",
      label: "google",
      icon: "",
      onClick: () => snsLoginGoogle(),
    },
    {
      id: "GITHUB",
      label: "github",
      icon: "",
      onClick: () => snsLoginGithub(),
    },
  ];

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
