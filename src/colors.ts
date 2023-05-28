export interface Color {
  name: string;
  bottom: string;
  text: string;
}

export const getColor = (name: string): Color => {
  switch (name) {
    case "아이네":
      return {
        name: "#ab6ee3",
        bottom: "#ac70e3",
        text: "#fff",
      };
    case "징버거":
      return {
        name: "#f0a957",
        bottom: "#ffbf00",
        text: "#fff",
      };
    case "릴파":
      return {
        name: "#9a9aff",
        bottom: "#131464",
        text: "#fff",
      };
    case "주르르":
      return {
        name: "#ff61ff",
        bottom: "#f686c6",
        text: "#fff",
      };
    case "고세구":
      return {
        name: "#61a6ff",
        bottom: "#7ddaf8",
        text: "#fff",
      };
    case "비챤":
      return {
        name: "#89b121",
        bottom: "#5fdb59",
        text: "#fff",
      };
    case "우왁굳":
      return {
        name: "#cfaa71",
        bottom: "#00bca3",
        text: "#fff",
      };
    case "천양":
      return {
        name: "#acfef8",
        bottom: "#acfef8",
        text: "#000",
      };
    case "뢴트게늄":
      return {
        name: "#ff73b9",
        bottom: "#ff69b4",
        text: "#000",
      };
    default:
      return {
        name: "#a970ff",
        bottom: "#a970ff",
        text: "#fff",
      };
  }
};
