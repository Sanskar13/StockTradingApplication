import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1971c2",
    margin: "0",
    padding: "10px 10px",
    fontSize: "15px",
    color: "#ffffff",
  },
  leftEntity: {
    width: "50%",
    justifyContent: "flex-start",
    display: "flex",
    flexWrap: "wrap",
  },
  rightEntity: {
    width: "50%",
    display: "flex",
    justifyContent: "flex-end",
    fontSize: "15px",
  },
  headerBtn: {
    border: "none",
    background: "none",
    padding: "10px 10px",
    margin: "0",
    fontSize: "2rem",
    cursor: "pointer",
    color: "#ffffff",
  },
};
