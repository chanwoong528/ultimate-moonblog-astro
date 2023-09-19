//@ts-nocheck
import http from "../http";

export const getGuestbooks = async () => {
  try {
    const getGBs = await http.get("/comment");
    const getGBsData = await getGBs.data;
    return getGBsData;
  } catch (error) {
    console.error("getGuestbooks[error]: ", error);
  }
};

export const patchCountGuestbook = async (id, type) => {
  try {
    console.log("patchCountGuestbook>>  ", id, type);
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
