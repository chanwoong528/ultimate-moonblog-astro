//@ts-nocheck

import React, { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { userInfo } from "../../common/store/storeUser";

import { patchCountGuestbook } from "../../http/guestbook/ApiGuestbook";
import {
  userInteractive,
  getUserInteractive,
} from "../../http/interactive/Apiinteractive";

import {
  COMMENT_PATCH_TYPE,
  CONTENT_TYPE,
} from "../../common/utils/constant/BE_DATA_TYPES";

const ListGuestbook = ({ guestbookData }) => {
  const $userInfo = useStore(userInfo);
  const [guestbooks, setGuestBooks] = useState(guestbookData);
  const [userLikes, setUserLikes] = useState([]);

  useEffect(() => {
    if (!!$userInfo.id) {
      fetchUserLikes($userInfo.id).then((likesData) => {
        setUserLikes(likesData);
      });
    }
  }, [$userInfo.id]);
  const fetchUserLikes = async (userId) => {
    const userInterData = await getUserInteractive(userId);
    console.log(userInterData);

    return userInterData.data;
  };
  const interactiveBtns = (content, userId) => {
    console.log(
      userLikes.find((item) => {
        return item.userId === userId && item.contentId === content._id;
      })
    );
    return (
      <>
        <button
          onClick={() => {
            onClickLike(content._id, COMMENT_PATCH_TYPE.likeInc);
          }}
        >
          {content.likes}++
        </button>
        <button>--</button>
      </>
    );
  };
  const onClickLike = async (id, type) => {
    const [interResult, patchCommentResult] = await Promise.all([
      userInteractive($userInfo.id, id, CONTENT_TYPE.comment, type),
      patchCountGuestbook(id, type),
    ]);

    setGuestBooks(
      guestbooks.map((item) => {
        if (item._id === patchCommentResult.data.id._id) {
          return { ...item, likes: patchCommentResult.data.id.likes };
        }
        return item;
      })
    );
  };

  return (
    <ul>
      {guestbooks.map((guestbook) => {
        return (
          <li key={guestbook._id}>
            <article>
              <p>{guestbook.content}</p>
              <p rel="author">{guestbook.userName}</p>
            </article>
            <div>
              {interactiveBtns(guestbook, $userInfo.id)}
              {/* <button
                onClick={() => {
                  onClickLike(guestbook._id, COMMENT_PATCH_TYPE.likeInc);
                }}
              >
                {guestbook.likes}++
              </button>
              <button>--</button> */}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ListGuestbook;
