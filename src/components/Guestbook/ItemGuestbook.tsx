//@ts-nocheck

import React, { useEffect, useState } from "react";
import EditorSun from "../Editor/EditorSun";
import {
  COMMENT_PATCH_TYPE,
  CONTENT_TYPE,
} from "../../common/utils/constant/BE_DATA_TYPES";
import { getGuestbooks } from "../../http/guestbook/ApiGuestbook";

const ItemGuestbook = ({
  guestbook,
  onClickLike,
  onClickShow,
  onClickSave,
  currentComment,
  btnRefs,
}) => {
  const [recommentArr, setRecommentArr] = useState([]);

  const onClickGetRecomments = async (parentId) => {
    const recommentsData = await getGuestbooks(parentId);
    setRecommentArr(recommentsData.data);
  };
  return (
    <li key={guestbook._id}>
      <article>
        <div dangerouslySetInnerHTML={{ __html: guestbook.content }} />
        <p rel="author">{guestbook.userName}</p>
      </article>
      {guestbook.childrenCount > 0 ? (
        <section>
          <header>
            <button
              onClick={() => {
                console.log(guestbook._id)
                onClickGetRecomments(guestbook._id);
              }}
            >
              {guestbook.childrenCount} number of comment
            </button>
          </header>
        </section>
      ) : null}

      {recommentArr.length > 0
        ? recommentArr.map((childComment) => {
          return (
            <p style={{ border: "1px solid red" }}>{childComment.content}</p>
          );
        })
        : null}
      <div>
        <h3>{guestbook.interactiveType}</h3>
        <button
          ref={(ref) => (btnRefs.current[0] = ref)}
          className={`btn-like${guestbook.interactiveType === COMMENT_PATCH_TYPE.likeInc
            ? " on"
            : ""
            }`}
          onClick={() => {
            onClickLike(guestbook._id, "likeBtn", guestbook.interactiveType);
          }}
        >
          {guestbook.likes}++
        </button>
        <button
          ref={(ref) => (btnRefs.current[1] = ref)}
          className={`btn-like${guestbook.interactiveType === COMMENT_PATCH_TYPE.dislikeInc
            ? " on"
            : ""
            }`}
          onClick={() => {
            
            onClickLike(guestbook._id, "dislikeBtn", guestbook.interactiveType);
          }}
        >
          {guestbook.dislikes}--
        </button>
        <button onClick={() => onClickShow(guestbook._id)}>
          Comment{guestbook.childrenCount}
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
};

export default ItemGuestbook;
