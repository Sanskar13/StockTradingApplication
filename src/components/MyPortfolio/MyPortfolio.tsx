import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPortfolioTransactions } from "../redux/thunk/getPortfolioTransactions";
import { updateTransaction } from "../redux/PortfolioSlice";
import { RootState } from "../redux/store";
import { PortfolioTypeTs } from "../utils/portfolio.type";
import { styles } from "../styles/MyPortfolio.styles";

export function MyPortfolio() {
  const { loading } = useSelector((state: RootState) => state.portfolio);
  const transactions: PortfolioTypeTs[] = useSelector(
    (state: RootState) => state.portfolio.transactions
  );
  const dispatch = useDispatch();
  const [transactionsCleared, setTransactionsCleared] =
    useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredTransactions, setFilteredTransactions] = useState<
    PortfolioTypeTs[]
  >([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value);
  };

  const handleStockSelection = (stockName: string) => {
    if (selectedStocks.includes(stockName)) {
      setSelectedStocks(selectedStocks.filter((name) => name !== stockName));
    } else {
      setSelectedStocks([...selectedStocks, stockName]);
    }
  };

  useEffect(() => {
    let data = [...transactions];

    data = data.filter((item: PortfolioTypeTs) =>
      item.stock_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (statusFilter !== "all") {
      data = data.filter(
        (item: PortfolioTypeTs) => item.status === statusFilter
      );
    }

    if (selectedStocks.length > 0) {
      data = data.filter((item: PortfolioTypeTs) =>
        selectedStocks.includes(item.stock_name)
      );
    }

    if (startDate && endDate) {
      data = data.filter((item: PortfolioTypeTs) => {
        const transactionDate = new Date(item.timestamp).getTime();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        return transactionDate >= start && transactionDate <= end;
      });
    }

    dispatch(updateTransaction(data));
  }, [searchQuery, statusFilter, selectedStocks, startDate, endDate]);

  useEffect(() => {
    if (transactionsCleared) {
      dispatch(getPortfolioTransactions());

      setTransactionsCleared(false);
    }
  }, [transactionsCleared]);

  useEffect(() => {
    dispatch(getPortfolioTransactions());
  }, [dispatch]);

  const handleClearAll = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSelectedStocks([]);
    setStartDate("");
    setEndDate("");
    setTransactionsCleared(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const groupedTransactions: { [key: string]: PortfolioTypeTs[] } = {};
  transactions.forEach((transaction) => {
    const date = new Date(transaction.timestamp).toDateString();
    if (!groupedTransactions[date]) {
      groupedTransactions[date] = [];
    }
    groupedTransactions[date].push(transaction);
  });

  return (
    <div className="myportfoliopage" style={styles.myPortfolioPage}>
      <div className="portfolio-filter-options" style={styles.portfolioFilter}>
        <div className="filter-clearAll" style={styles.filterClearAll}>
          <span style={{ padding: "10px 30px", width: "50%" }}>Filters</span>
          <button
            onClick={handleClearAll}
            style={{
              border: "none",
              outline: "none",
              color: "#1971c2",
              fontSize: "1.3rem",
              backgroundColor: "transparent",
            }}
          >
            Clear All
          </button>
        </div>
        <div className="filter-search" style={styles.filterSearch}>
          <input
            type="text"
            placeholder="Search for a Stock"
            style={{
              width: "80%",
              margin: "0 auto",
              fontSize: "1rem",
              background: "transparent",
              borderRadius: "10px",
              padding: "5px 10px",
              border: "2px solid #6f7072",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-using-date" style={styles.filterDate}>
          <input
            type="date"
            id="start"
            name="trip-start"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min="2001-01-01"
            max="2024-12-31"
            style={{
              backgroundColor: "transparent",
              margin: "5px 10px",
              borderRadius: "10px",
              width: "40%",
              padding: "5px 10px",
              border: "2px solid #6f7072",
            }}
          />
          <input
            type="date"
            id="end"
            name="trip-end"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min="2001-01-01"
            max="2024-12-31"
            style={{
              backgroundColor: "transparent",
              margin: "5px 10px",
              borderRadius: "10px",
              width: "40%",
              padding: "5px 10px",
              border: "2px solid #6f7072",
            }}
          />
        </div>
        <div className="filter-using-status" style={styles.filterStatus}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <input
              type="radio"
              id="passed"
              name="status"
              value="Passed"
              checked={statusFilter === "Passed"}
              onChange={handleStatusChange}
              style={styles.radioButton}
            />
            <label htmlFor="passed" style={{ marginRight: "10px" }}>
              Passed
            </label>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <input
              type="radio"
              id="failed"
              name="status"
              value="Failed"
              checked={statusFilter === "Failed"}
              onChange={handleStatusChange}
              style={styles.radioButton}
            />
            <label htmlFor="failed" style={{ marginRight: "10px" }}>
              Failed
            </label>
          </div>
        </div>

        <div
          className="filter-using-stocknames"
          style={styles.filterStockNames}
        >
          {transactions.map((item: PortfolioTypeTs) => (
            <div key={item.stock_symbol}>
              <input
                type="checkbox"
                id={item.stock_symbol}
                name={item.stock_name}
                value={item.stock_name}
                onChange={() => handleStockSelection(item.stock_name)}
              />
              <label htmlFor={item.stock_symbol}>{item.stock_name}</label>
            </div>
          ))}
        </div>
      </div>
      <div
        className="portfolio-all-transactions"
        style={styles.portfolioAllTransactions}
      >
        {Object.entries(groupedTransactions).map(([date, transactions]) => (
          <div key={date}>
            <div
              style={{ borderBottom: "1px dotted #000", padding: "10px 5px" }}
            >
              {date}
            </div>
            <ul style={styles.transactionList}>
              {transactions.map((item: PortfolioTypeTs) => (
                <li key={item.stock_name} style={styles.eachTransaction}>
                  <span style={styles.stockName}>{item.stock_name}</span>
                  <span style={styles.stockSymbol}>{item.stock_symbol}</span>
                  <span style={styles.stockPrice}>
                    {item.transaction_price}
                  </span>
                  <span style={styles.stockTimeStamp}>
                    {formatTime(item.timestamp)}
                  </span>
                  <span
                    style={{
                      ...styles.statusType,
                      backgroundColor:
                        item.status === "Failed" ? "#e76d6d" : "#a8d5b1",
                    }}
                  ></span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {filteredTransactions.length === 0 && transactionsCleared && (
          <div>No Transactions available</div>
        )}
      </div>
    </div>
  );
}
