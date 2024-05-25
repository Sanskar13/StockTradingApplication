import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";
import { StocksTypesTs } from "../utils/stocks.types";
import { getStocks } from "../redux/thunk/getStocks";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { styles } from "../styles/Dashboard.styles";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const stocks = useSelector((state: RootState) => state.dashboard.stocks);

  const [watchlist, setWatchlist] = useState<StocksTypesTs[]>([]);
  const [exploreStocks, setExploreStocks] = useState<StocksTypesTs[]>([]);
  const [activeTab, setActiveTab] = useState<"explore" | "watchlist">(
    "explore"
  );
  const [currentPageExplore, setCurrentPageExplore] = useState<number>(1);
  const [currentPageWatchlist, setCurrentPageWatchlist] = useState<number>(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(getStocks());
  }, [dispatch]);

  useEffect(() => {
    const storedWatchlist = localStorage.getItem("watchlist");
    if (storedWatchlist) {
      setWatchlist(JSON.parse(storedWatchlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    if (stocks) {
      setExploreStocks(stocks);
    }
  }, [stocks]);

  const handleStockClick = (stock: StocksTypesTs) => {
    const isInWatchlist = watchlist.some(
      (item) => item.stock_symbol === stock.stock_symbol
    );
    if (isInWatchlist) {
      removeFromWatchlist(stock);
    } else {
      addToWatchlist(stock);
    }
  };

  const addToWatchlist = (stock: StocksTypesTs) => {
    setWatchlist((prevState) => [...prevState, stock]);
  };

  const removeFromWatchlist = (stock: StocksTypesTs) => {
    setWatchlist((prevState) =>
      prevState.filter((item) => item.stock_symbol !== stock.stock_symbol)
    );
  };

  const handlePageChangeExplore = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPageExplore(pageNumber);
  };

  const handlePageChangeWatchlist = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPageWatchlist(pageNumber);
  };

  const indexOfLastItemExplore = currentPageExplore * itemsPerPage;
  const indexOfFirstItemExplore = indexOfLastItemExplore - itemsPerPage;
  let currentItemsExplore = exploreStocks.slice(
    indexOfFirstItemExplore,
    indexOfLastItemExplore
  );

  currentItemsExplore = currentItemsExplore.sort((a, b) =>
    a.stock_name.localeCompare(b.stock_name)
  );

  const indexOfLastItemWatchlist = currentPageWatchlist * itemsPerPage;
  const indexOfFirstItemWatchlist = indexOfLastItemWatchlist - itemsPerPage;
  let currentItemsWatchlist = watchlist.slice(
    indexOfFirstItemWatchlist,
    indexOfLastItemWatchlist
  );

  currentItemsWatchlist = currentItemsWatchlist.sort((a, b) =>
    a.stock_name.localeCompare(b.stock_name)
  );

  return (
    <div>
      <div>
        <button
          style={styles.dashboardBtn}
          onClick={() => setActiveTab("explore")}
        >
          Explore
        </button>
        <button
          style={styles.dashboardBtn}
          onClick={() => setActiveTab("watchlist")}
        >
          My WatchList
        </button>
      </div>
      <div className="stocklist" style={styles.stockList}>
        <div style={styles.stockTypes}>
          <div style={styles.stockCompanyTitle}>Company</div>
          <div style={styles.stockDetail}>Base Price</div>
          <div style={styles.stockDetail}>Watchlist</div>
        </div>
        {activeTab === "explore" && (
          <div style={styles.listItems}>
            <ul>
              {currentItemsExplore.map((stock) => (
                <li key={stock.stock_symbol} style={styles.stockListing}>
                  <Link
                    to={`/stock/${stock.stock_symbol}`}
                    style={styles.stockLink}
                  >
                    <div style={styles.stockCompany}>{stock.stock_name}</div>
                  </Link>
                  <div style={styles.stockDetail}>{stock.base_price}</div>
                  <div>
                    <button
                      onClick={() => handleStockClick(stock)}
                      style={styles.watchListBtn}
                    >
                      {watchlist.some(
                        (item) => item.stock_symbol === stock.stock_symbol
                      ) ? (
                        <CloseIcon style={{ color: "#e13b3b", fontSize: 20 }} />
                      ) : watchlist.includes(stock) ? (
                        <CheckCircleRoundedIcon
                          style={{ color: "#468ccd", fontSize: 20 }}
                        />
                      ) : (
                        <AddCircleOutlineIcon
                          style={{ color: "#468ccd", fontSize: 20 }}
                        />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div style={styles.paginatedWindow}>
              <Stack spacing={2}>
                <Pagination
                  count={Math.ceil(exploreStocks.length / itemsPerPage)}
                  page={currentPageExplore}
                  onChange={handlePageChangeExplore}
                />
              </Stack>
            </div>
          </div>
        )}
        {activeTab === "watchlist" && (
          <div style={styles.listItems}>
            <ul>
              {currentItemsWatchlist.map((stock) => (
                <li key={stock.stock_symbol} style={styles.stockListing}>
                  <Link
                    to={`/stock/${stock.stock_symbol}`}
                    style={styles.stockLink}
                  >
                    <div style={styles.stockCompany}>{stock.stock_name}</div>
                  </Link>{" "}
                  <div style={styles.stockDetail}>{stock.base_price}</div>
                  <button
                    onClick={() => removeFromWatchlist(stock)}
                    style={styles.watchListBtn}
                  >
                    <CheckCircleRoundedIcon
                      style={{ color: "#468ccd", fontSize: 20 }}
                    />
                  </button>
                </li>
              ))}
            </ul>
            <div style={styles.paginatedWindow}>
              <Stack spacing={2}>
                <Pagination
                  count={Math.ceil(watchlist.length / itemsPerPage)}
                  page={currentPageWatchlist}
                  onChange={handlePageChangeWatchlist}
                />
              </Stack>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
