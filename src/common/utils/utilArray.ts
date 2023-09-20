//@ts-nocheck

export const joinTwoArrayCommonId = (array1, array2, commonKey, pk) => {
  const map1 = new Map(array1.map((item) => [item[commonKey], item]));
  const mergedArray = array2.map((item2) => {
    const item1 = map1.get(item2[pk]);
    if (item1) {
      // Merge properties from both arrays
      return { ...item1, ...item2 };
    }
    return item2; // If not found in array1, just include it as is
  });
  return mergedArray;
};
