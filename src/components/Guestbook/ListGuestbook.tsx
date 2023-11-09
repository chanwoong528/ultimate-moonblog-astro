//@ts-nocheck

import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { userInfo } from "../../common/store/storeUser";
import ItemGuestbook from "./ItemGuestbook";

import {
  getGuestbooks,
  patchCountGuestbook,
  postGuestbook,
} from "../../http/guestbook/ApiGuestbook";
import {
  userInteractive,
  getUserInteractive,
} from "../../http/interactive/ApiInteractive";
import { joinTwoArrayCommonId } from "../../common/utils/utilArray";

import {
  COMMENT_PATCH_TYPE,
  CONTENT_TYPE,
} from "../../common/utils/constant/BE_DATA_TYPES";
import TextArea from "../Editor/TextArea";

const ListGuestbook = ({ }) => {
  const $userInfo = useStore(userInfo);
  const [guestbooks, setGuestBooks] = useState([]);
  const [currentComment, setCurrentComment] = useState("");

  // const btnRefs = useRef([]);
  useEffect(() => {

    fetchUserLikes($userInfo.id);
  }, []);
  const fetchUserLikes = async (userId) => {
    const guestbookArr = await fetchGuestbooks()
    if (!!$userInfo.id) {
      const userInterData = await getUserInteractive(userId);
      return setGuestBooks(joinTwoArrayCommonId(
        userInterData.data,
        guestbookArr,
        "contentId",
        "_id"
      ));
    }
    return setGuestBooks(guestbookArr);
  };
  const fetchGuestbooks = async () => {
    const guestbookData = await getGuestbooks();
    return guestbookData.data
  }
  const onClickShow = (guestbookId) => {
    currentComment === guestbookId
      ? setCurrentComment("")
      : setCurrentComment(guestbookId);
  };
  const onClickLike = async (id, btnType, currentType) => {
    if (!$userInfo.id) return window.location.href = "/auth"
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
          break;
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

    const newGuestbook = await guestbooks.map((item) => {
      if (item._id === patchCommentResult.data.id._id) {
        return {
          ...item,
          likes: patchCommentResult.data.id.likes,
          dislikes: patchCommentResult.data.id.dislikes,
          interactiveType: toBeType,
        };
      }
      return item;
    })

    setGuestBooks(newGuestbook);

  };
  const onClickSave = async (content, parent?) => {

    if (!!parent) {
      const postChild = await postGuestbook(content, parent);
      const tobeAddedData = await postChild.data;
      const newGuestbookData = guestbooks.map((item) => {
        if (item._id === postChild.data.parentId) {
          return {
            ...item,
            childrenCount: item.childrenCount + 1,
          };
        }
        return item;
      })
      setGuestBooks(newGuestbookData);
    } else {
      const postComment = await postGuestbook(content);
      setGuestBooks([...guestbooks, await postComment.data]);
    }
  };

  return (
    <>
      <ul>
        {guestbooks.map((guestbook) => {
          return (
            <ItemGuestbook
              key={guestbook._id}
              guestbook={guestbook}
              onClickShow={onClickShow}
              onClickLike={onClickLike}
              onClickSave={onClickSave}
              currentComment={currentComment}
            // btnRefs={btnRefs}
            />
          );
        })}
      </ul>
      <TextArea onClickSave={onClickSave} />
      {/* <EditorSun type={CONTENT_TYPE.comment} onClickSave={onClickSave} /> */}
    </>
  );
};

export default ListGuestbook;
