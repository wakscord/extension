export const prefetchImage = (url: string) => {
  const img = new Image();

  img.referrerPolicy = "no-referrer";
  img.src = url;
};
