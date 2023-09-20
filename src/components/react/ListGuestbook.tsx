//@ts-nocheck

import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { userInfo } from "../../common/store/storeUser";

import EditorSun from "./EditorSun";

import {
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

const ListGuestbook = ({ guestbookData }) => {
  const $userInfo = useStore(userInfo);
  const [guestbooks, setGuestBooks] = useState(guestbookData);
  const [currentComment, setCurrentComment] = useState("");
  const btnRefs = useRef([]);
  useEffect(() => {
    console.log("@@@@@@@@@@@@@", guestbookData);
    if (!!$userInfo.id) {
      fetchUserLikes($userInfo.id);
    }
  }, [$userInfo.id]);
  const fetchUserLikes = async (userId) => {
    const userInterData = await getUserInteractive(userId);
    setGuestBooks(
      joinTwoArrayCommonId(
        userInterData.data,
        guestbookData,
        "contentId",
        "_id"
      )
    );
    return userInterData.data;
  };
  const onClickShow = (guestbookId) => {
    currentComment === guestbookId
      ? setCurrentComment("")
      : setCurrentComment(guestbookId);
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
          console.log(currentType);
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
    setGuestBooks(
      guestbooks.map((item) => {
        if (item._id === patchCommentResult.data.id.id) {
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
  const onClickSave = async (content, parent?) => {
    console.log(parent);
    console.log(content);

    if (!!parent) {
      const postChild = await postGuestbook(content, parent);
      const tobeAddedData = await postChild.data;
      console.log(postChild.data);
      console.log(
        guestbooks.map((item) => {
          if (item._id === postChild.data.parentId) {
            return {
              ...item,
              childComment: { ...item.childComment, ...postChild.data },
            };
          }
          return item;
        })
      );

      // setGuestBooks();
    } else {
      const postComment = await postGuestbook(content);
      console.log(postComment);
    }
  };

  return (
    <>
      <ul>
        {guestbooks.map((guestbook) => {
          return (
            <li key={guestbook._id}>
              <article>
                <div dangerouslySetInnerHTML={{ __html: guestbook.content }} />
                <p rel="author">{guestbook.userName}</p>
              </article>
              {guestbook.childComment.map((childComment) => {
                return (
                  <p style={{ border: "1px solid red" }}>
                    {childComment.content}
                  </p>
                );
              })}
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
                      guestbook._id,
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
                      guestbook._id,
                      "dislikeBtn",
                      guestbook.interactiveType
                    );
                  }}
                >
                  {guestbook.dislikes}--
                </button>
                <button onClick={() => onClickShow(guestbook._id)}>
                  Commnet
                </button>
              </div>
              {currentComment === guestbook._id ? (
                <EditorSun
                  type={CONTENT_TYPE.comment}
                  parent={currentComment}
                  onClickSave={onClickSave}
                />
              ) : null}
            </li>
          );
        })}
      </ul>
      <EditorSun type={CONTENT_TYPE.comment} onClickSave={onClickSave} />
    </>
  );
};

export default ListGuestbook;
