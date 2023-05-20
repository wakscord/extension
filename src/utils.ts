export const decodeText = (text: string): string => {
  return (
    new DOMParser().parseFromString(decodeURI(text), "text/html")
      .documentElement.textContent || ""
  );
};

export const mergeFlag = (values: number[]): number => {
  return values.reduce((acc, cur) => acc | cur, 0);
};
