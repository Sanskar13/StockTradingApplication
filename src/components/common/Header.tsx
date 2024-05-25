import { Link } from "react-router-dom";
import { styles } from "../styles/Header.styles";
import logo from "./logo.png";

export function Header() {
  return (
    <div className="header-container" style={styles.headerContainer}>
      <div className="left-entity" style={styles.leftEntity}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={logo} alt="Logo" />
        </Link>
        <h1>KDU Stock Market</h1>
      </div>
      <div className="right-entity" style={styles.rightEntity}>
        <button type="submit" className="header-btn" style={styles.headerBtn}>
          Summarizer
        </button>
        <Link to="/portfolio" className="header-link" style={styles.headerLink}>
          <button type="button" className="header-btn" style={styles.headerBtn}>
            My Portfolio
          </button>
        </Link>
      </div>
    </div>
  );
}
