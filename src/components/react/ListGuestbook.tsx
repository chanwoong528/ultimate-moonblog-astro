//@ts-nocheck

import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { userInfo } from "../../common/store/storeUser";

import { patchCountGuestbook } from "../../http/guestbook/ApiGuestbook";
import {
  userInteractive,
  getUserInteractive,
} from "../../http/interactive/ApiInteractive";

import { joinTwoArrayCommonId } from "../../common/utils/utilArray";

import {
  COMMENT_PATCH_TYPE,
  CONTENT_TYPE,
} from "../../common/utils/constant/BE_DATA_TYPES";

const ListGuestbook = ({ guestbookData }) => {
  const $userInfo = useStore(userInfo);
  const [guestbooks, setGuestBooks] = useState(guestbookData);
  const btnRefs = useRef([]);
  useEffect(() => {
    if (!!$userInfo.id) {
      fetchUserLikes($userInfo.id);
    }
  }, [$userInfo.id]);
  const fetchUserLikes = async (userId) => {
    const userInterData = await getUserInteractive(userId);
    setGuestBooks(
      joinTwoArrayCommonId(userInterData.data, guestbookData, "contentId")
    );
    return userInterData.data;
  };

  const onClickLike = async (id, btnType, currentType) => {
    if (btnRefs.current.length > 0) {
      btnRefs.current.forEach((btn) =>
        btn.setAttribute("disabled", "disabled")
      );
    }
    let toBeType;
    let apiSendType;
    if (btnType === "likeBtn") {
      switch (currentType) {
        case COMMENT_PATCH_TYPE.likeDes:
          toBeType = COMMENT_PATCH_TYPE.likeInc;
          apiSendType = COMMENT_PATCH_TYPE.likeInc;
          break;
        case COMMENT_PATCH_TYPE.likeInc:
          toBeType = COMMENT_PATCH_TYPE.likeDes;
          apiSendType = COMMENT_PATCH_TYPE.likeDes;
          break;
        case COMMENT_PATCH_TYPE.dislikeInc:
          toBeType = COMMENT_PATCH_TYPE.likeInc;
          apiSendType = COMMENT_PATCH_TYPE.dislikeToLike;
          break;
        default:
          toBeType = COMMENT_PATCH_TYPE.likeInc;
          apiSendType = COMMENT_PATCH_TYPE.likeInc;
          break;
      }
    } else {
      switch (currentType) {
        case COMMENT_PATCH_TYPE.dislikeDes:
          toBeType = COMMENT_PATCH_TYPE.dislikeInc;
          apiSendType = COMMENT_PATCH_TYPE.dislikeInc;
          break;
        case COMMENT_PATCH_TYPE.dislikeInc:
          toBeType = COMMENT_PATCH_TYPE.dislikeDes;
          apiSendType = COMMENT_PATCH_TYPE.dislikeDes;
        case COMMENT_PATCH_TYPE.likeInc:
          toBeType = COMMENT_PATCH_TYPE.dislikeInc;
          apiSendType = COMMENT_PATCH_TYPE.likeToDislike;
          break;
        default:
          toBeType = COMMENT_PATCH_TYPE.dislikeInc;
          apiSendType = COMMENT_PATCH_TYPE.dislikeInc;
          break;
      }
    }

    const [interResult, patchCommentResult] = await Promise.all([
      userInteractive($userInfo.id, id, CONTENT_TYPE.comment, toBeType),
      patchCountGuestbook(id, apiSendType),
    ]);
    setGuestBooks(
      guestbooks.map((item) => {
        if (item.id === patchCommentResult.data.id.id) {
          return {
            ...item,
            likes: patchCommentResult.data.id.likes,
            dislikes: patchCommentResult.data.id.dislikes,
            interactiveType: toBeType,
          };
        }
        return item;
      })
    );
    btnRefs.current.forEach((btn) => btn.removeAttribute("disabled"));
  };

  return (
    <ul>
      {guestbooks.map((guestbook) => {
        return (
          <li key={guestbook.id}>
            <article>
              <p>{guestbook.content}</p>
              <p rel="author">{guestbook.userName}</p>
            </article>
            <div>
              <h3>{guestbook.interactiveType}</h3>
              <button
                ref={(ref) => (btnRefs.current[0] = ref)}
                className={`btn-like${
                  guestbook.interactiveType === COMMENT_PATCH_TYPE.likeInc
                    ? " on"
                    : ""
                }`}
                onClick={() => {
                  onClickLike(
                    guestbook.id,
                    "likeBtn",
                    guestbook.interactiveType
                  );
                }}
              >
                {guestbook.likes}++
              </button>
              <button
                ref={(ref) => (btnRefs.current[1] = ref)}
                className={`btn-like${
                  guestbook.interactiveType === COMMENT_PATCH_TYPE.dislikeInc
                    ? " on"
                    : ""
                }`}
                onClick={() => {
                  onClickLike(
                    guestbook.id,
                    "dislikeBtn",
                    guestbook.interactiveType
                  );
                }}
              >
                {guestbook.dislikes}--
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ListGuestbook;
