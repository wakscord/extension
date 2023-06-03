export const decodeText = (text: string): string => {
  return (
    new DOMParser().parseFromString(decodeURI(text), "text/html")
      .documentElement.textContent || ""
  );
};
