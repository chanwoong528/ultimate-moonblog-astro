//@ts-nocheck

import http from "../http";

export const getPost = async (categoryId?, postId?) => {
  try {
    const postRes = await http.get("/api/post", {
      params: {
        ...(!!categoryId && { categoryId: categoryId }),
        ...(!!postId && { postId: postId }),
      },
    });
    const postData = await postRes.data;
    return postData;
  } catch (error) {
    console.error("getPost[error]: ", error);
  }
};
