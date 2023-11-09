//@ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import {
  COMMENT_PATCH_TYPE,
} from "../../common/utils/constant/BE_DATA_TYPES";
import { getGuestbooks } from "../../http/guestbook/ApiGuestbook";
import TextArea from "../Editor/TextArea";

const ItemGuestbook = ({
  guestbook,
  onClickLike,
  onClickShow,
  onClickSave,
  currentComment,
}) => {



  const [showRecomment, setShowRecomment] = useState(false);
  const [recommentArr, setRecommentArr] = useState([]);
  const btnsRefs = useRef([]);

  useEffect(() => {
    if (!!showRecomment) {
      getRecomments(guestbook._id);
    }
  }, [showRecomment, guestbook.childrenCount])

  const getRecomments = async (parentId) => {
    const recommentsData = await getGuestbooks(parentId);
    setRecommentArr(recommentsData.data);
  };


  const onClickLikeBtn = (guestId, btnType, interactType) => {
    // guestbook._id, "likeBtn", guestbook.interactiveType
    btnsRefs.current.forEach((btn) => {
      btn.setAttribute("disabled", "disabled")
    })
    onClickLike(guestId, btnType, interactType).finally(() => {
      btnsRefs.current.forEach((btn) => {
        btn.removeAttribute("disabled")
      })
      console.log(guestbook.parentId)
      getRecomments(guestbook.parentId)
    })
  }
  return (
    <li key={guestbook._id}>
      <article>
        <div dangerouslySetInnerHTML={{ __html: guestbook.content }} />
        <p rel="author">{guestbook.userName}</p>
      </article>
      {!guestbook.parentId && guestbook.childrenCount > 0 ? (
        <section>
          <header>
            <button
              onClick={() => setShowRecomment(!showRecomment)}
            >
              {guestbook.childrenCount} number of comment
            </button>
          </header>
        </section>
      ) : null
      }
      <ul>
        {
          recommentArr.length && !!showRecomment > 0
            ? recommentArr.map((childComment) => {
              console.log(childComment)
              return (

                <ItemGuestbook key={childComment._id} guestbook={childComment} onClickLike={onClickLike} />
                // <p key={childComment._id} style={{ border: "1px solid red" }}>{childComment.content}</p>
              );
            })
            : null
        }
      </ul>
      <div>
        <h3>{guestbook.interactiveType}</h3>
        <button
          ref={(ref) => btnsRefs.current[0] = ref}
          className={`btn-like${guestbook.interactiveType === COMMENT_PATCH_TYPE.likeInc
            ? " on"
            : ""
            }`}
          onClick={() => {
            onClickLikeBtn(guestbook._id, "likeBtn", guestbook.interactiveType);
          }}
        >
          {guestbook.likes}++
        </button>
        <button
          ref={(ref) => btnsRefs.current[1] = ref}
          className={`btn-like${guestbook.interactiveType === COMMENT_PATCH_TYPE.dislikeInc
            ? " on"
            : ""
            }`}
          onClick={() => {
            onClickLikeBtn(guestbook._id, "dislikeBtn", guestbook.interactiveType)
          }}
        >
          {guestbook.dislikes}--
        </button>
        {!guestbook.parentId ? <button onClick={() => onClickShow(guestbook._id)}>
          Comment{guestbook.childrenCount}
        </button> : null}
      </div>
      {
        currentComment === guestbook._id && !guestbook.parentId ? (
          <TextArea
            onClickSave={onClickSave}
            parent={currentComment}
          />
        ) : null
      }
    </li >
  );
};

export default ItemGuestbook;
