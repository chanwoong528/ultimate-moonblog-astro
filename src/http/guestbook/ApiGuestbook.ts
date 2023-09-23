//@ts-nocheck
import http from "../http";

export const getGuestbooks = async (parentId?) => {
  try {
    const getGBs = await http.get("/comment", {
      params: {
        parentId,
      },
    });
    const getGBsData = await getGBs.data;
    return getGBsData;
  } catch (error) {
    console.error("getGuestbooks[error]: ", error);
  }
};

export const patchCountGuestbook = async (id, type) => {
  try {
    const patchCount = await http.patch(
      "/comment/count",
      {},
      {
        params: {
          id: id,
          type,
        },
      }
    );
    return patchCount.data;
  } catch (error) {
    console.error("patchCountGuestbook[error]: ", error);
  }
};

export const postGuestbook = async (content, parentId?) => {
  try {
    const postGuestbook = await http.post(
      "/comment",
      { content },
      { params: { parentId } }
    );
    console.log(postGuestbook);
    return postGuestbook.data;
  } catch (error) {}
};
