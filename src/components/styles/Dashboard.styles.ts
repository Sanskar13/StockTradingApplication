import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
  dashboardBtn: {
    border: "none",
    background: "none",
    padding: "10px 10px",
    margin: "0",
    fontSize: "1rem",
    cursor: "pointer",
    color: "#000",
    textDecoration: "none",
  },
  listItems: {
    display: "flex",
    flexWrap: "wrap",
  },
  stockList: {
    border: "3px solid #5b6065",
    display: "flex",
    flexDirection: "column",
    width: "60vw",
    margin: "40px auto",
    height: "70vh",
    borderRadius: "30px",
    color: "#5b6065",
  },

  stockTypes: {
    borderBottom: "3px solid #5b6065",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  stockCompanyTitle: {
    width: "37vw",
    margin: "5px 30px",
    fontSize: "1.2rem",
    padding: "5px 20px",
  },
  stockCompany: {
    width: "40vw",
    fontSize: "1.3rem",
    margin: "2px",
  },
  stockDetail: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "8vw",
  },
  stockListing: {
    display: "flex",
    flexDirection: "row",
    listStyleType: "none",
    padding: "5px 10px",
    width: "55vw",
    borderBottom: "2px solid #cccdce",
  },
  paginatedWindow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "4rem",
    margin: "0 auto",
  },
  watchListBtn: {
    border: "none",
    background: "none",
    padding: "10px 10px",
    margin: "0",
    fontSize: "1rem",
    cursor: "pointer",
  },
  stockLink: {
    textDecoration: "none",
    color: "#5b6065",
  },
};
