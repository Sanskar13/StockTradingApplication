import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./components/redux/store";
import Dashboard from "./components/Dashboard/Dashboard";
import { styles } from "./components/styles/App.styles";
import { Header } from "./components/common/Header";
import { StockPage } from "./components/StockPage/StockPage";
import { MyPortfolio } from "./components/MyPortfolio/MyPortfolio";

function App() {
  return (
    <div style={styles.container}>
      <Provider store={store}>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stock/:symbol" element={<StockPage />} />
            <Route path="/portfolio" element={<MyPortfolio />} />
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
