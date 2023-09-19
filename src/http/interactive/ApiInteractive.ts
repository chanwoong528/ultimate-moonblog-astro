//@ts-nocheck
import http from "../http";
export const userInteractive = async (
  userId,
  contentId,
  contentType,
  interactiveType
) => {
  console.log(
    "userInteractive>>  ",
    userId,
    contentId,
    contentType,
    interactiveType
  );
  try {
    const patchOrCreateInter = await http.post(
      "/interactive",
      {
        userId,
        contentId,
        contentType,
        interactiveType,
      },
      {}
    );

    return patchOrCreateInter.data;
  } catch (error) {
    console.error("patchOrCreateInter[error]: ", error);
  }
};
export const getUserInteractive = async (userId) => {
  try {
    const fetchUserInter = await http.get("/interactive", {
      params: {
        userId,
      },
    });

    return fetchUserInter.data;
  } catch (error) {
    console.error("patchOrCreateInter[error]: ", error);
  }
};
