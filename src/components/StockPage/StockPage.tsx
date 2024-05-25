import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { styles } from "../styles/Stock.styles";
import { Socket, io } from "socket.io-client";

interface StockData {
  stock_name: string;
  stock_symbol: string;
  base_price: number;
}

interface Transaction {
  id: string;
  quantity: number;
  timestamp: string;
  type: string;
}

export function StockPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const [stockData, setStockData] = useState<number[]>([]);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [stockname, setStockName] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
    []
  );
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<number[]>([]);

  useEffect(() => {
    const storedSocketId = sessionStorage.getItem("socketId");
    const newSocket = io("http://localhost:3002", {
      query: {
        socketId: storedSocketId,
      },
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      sessionStorage.setItem("socketId", newSocket.id);
      console.log(`Socket connected with ID: ${newSocket.id}`);

      newSocket.emit("getBalance");
      newSocket.emit("subscribeSymbol", symbol);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log(socket.id);

      socket.emit("getBalance");
      console.log("notification1", notifications);
      socket.emit("subscribeSymbol", symbol);
    });

    socket.on("balanceUpdate", (newBalance: number) => {
      console.log("balanceUpdate ", newBalance);
      console.log("notification", notifications);
      setBalance(newBalance);
    });

    socket.on("transactionHistory", (transactions: Transaction[]) => {
      setTransactionHistory(transactions);
    });

    socket.on("liveNotification", (quantity: number) => {
      console.log(notifications, quantity, "doing something");
      setNotifications((prevNotifications) => [...prevNotifications, quantity]);
    });

    return () => {
      socket.off("balanceUpdate");
      socket.off("transactionHistory");
      socket.off("liveNotification");
      socket.emit("unsubscribeSymbol", symbol);
    };
  }, [socket, symbol]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://kdu-automation.s3.ap-south-1.amazonaws.com/mini-project-apis/stocks.json"
        );
        const data: StockData[] = await response.json();
        const stock = data.find((item) => item.stock_symbol === symbol);
        if (stock) {
          setStockName(stock.stock_name);
          setBasePrice(stock.base_price);
          generateRandomPrice(stock.base_price);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchData();

    const interval = setInterval(() => generateRandomPrice(basePrice), 5000);

    return () => clearInterval(interval);
  }, [symbol, basePrice]);

  const generateRandomPrice = (basePrice: number) => {
    const newPrice = basePrice + Math.random() * 20 - 10;
    setStockData((prevData) => [...prevData, newPrice]);
  };

  const handleBuy = () => {
    const qty = parseInt(inputValue);

    if (inputValue == "") return;
    setInputValue("");

    const currentStockPrice = stockData[stockData.length - 1];
    const totalCost = qty * currentStockPrice;
    console.log(balance);
    if (totalCost > balance) {
      alert("Insufficient Funds");
      return;
    }

    if (socket) {
      socket.emit("buy", {
        symbol,
        quantity: qty,
        totalCost,
        currentStockPrice,
      });
    }
  };

  const handleSell = () => {
    const qty = parseInt(inputValue);

    if (inputValue == "") return;
    setInputValue("");

    const currentStockPrice = stockData[stockData.length - 1];
    const totalCost = qty * currentStockPrice;

    if (socket) {
      socket.emit("sell", {
        symbol,
        quantity: qty,
        totalCost,
        currentStockPrice,
      });
    }
  };

  return (
    <div className="stock-page-container" style={styles.stockPageContainer}>
      <div className="stock-particulars" style={styles.stockParticulars}>
        <div className="stock-selection" style={styles.stockSelection}>
          <div className="stock-Identifier" style={styles.stockIdentifier}>
            <div className="stock-idn-symbol" style={styles.stockIdnSymbol}>
              {symbol}
            </div>
            <div className="stock-idn-name">{stockname}</div>
            <div className="stock-dropdown-arrow">V</div>
            <div className="stock-percentage-change"></div>
          </div>
          <div className="stock-price" style={styles.stockPrice}>
            <span>Price</span>
            <div
              className="price-inflation-arrow"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "40%",
                alignItems: "center",
              }}
            >
              <div
                className="price-inflation"
                style={{
                  color:
                    stockData.length > 1
                      ? stockData[stockData.length - 1] > basePrice
                        ? "green"
                        : "red"
                      : "black",
                }}
              >
                {stockData.length > 0 &&
                  `$${stockData[stockData.length - 1].toFixed(2)}`}
              </div>
              <div
                className="inflation-arrow"
                style={{
                  color:
                    stockData.length > 1 &&
                    (stockData[stockData.length - 1] >
                    stockData[stockData.length - 2]
                      ? "green"
                      : "red"),
                  padding: "0px 10px",
                  fontSize: "35px",
                }}
              >
                {stockData.length > 1 &&
                  (stockData[stockData.length - 1] >
                  stockData[stockData.length - 2]
                    ? "\u2191"
                    : "\u2193")}
              </div>
            </div>
          </div>
          <div className="stock-qty" style={styles.stockQty}>
            <input
              type="text"
              placeholder="Enter Qty"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={styles.qtyHolder}
            />
          </div>
          <div className="stock-buy-btn" style={styles.stockBtn}>
            <button
              onClick={handleBuy}
              style={{
                ...styles.allBtn,
                backgroundColor: "#b2f2bb",
                border: "1px solid green",
                color: "green",
              }}
            >
              Buy
            </button>
            <button
              onClick={handleSell}
              style={{
                ...styles.allBtn,
                backgroundColor: "#ffc9c9",
                border: "1px solid red",
                color: "red",
              }}
            >
              Sell
            </button>
          </div>
        </div>
        <div
          className="stock-chart"
          style={{ ...styles.stockChart, height: "600px", overflowX: "auto" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            {stockData.map((price, index) => {
              const priceDiff = price - basePrice;
              const barHeight = Math.abs(priceDiff) * 30;
              const barColor = priceDiff >= 0 ? "#b2f2bb" : "#ffc9c9";
              const borderColor =
                barColor === "#b2f2bb" ? "#3ea852" : "#e65c5c";

              return (
                <div
                  key={index}
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: barColor,
                    width: "20px",
                    margin: "2px",
                    border: `2px solid ${borderColor}`,
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="stock-transactions" style={styles.stockTransactions}>
        <div
          className="stock-history"
          style={{ ...styles.stockHistory, overflowY: "auto" }}
        >
          <span style={{ fontSize: "1.5rem" }}>History</span>

          {transactionHistory?.map((transaction) => (
            <div
              className="transaction-history"
              style={styles.transactionHistory}
            >
              <li key={transaction.id} style={styles.historySection}>
                <div
                  className="stock-transaction-desc"
                  style={styles.stockTransactionDesc}
                >
                  <div
                    className="stock-transaction-qty"
                    style={styles.stockTransactionQty}
                  >
                    {transaction.quantity}&nbsp;stocks
                  </div>
                  <div className="stock-transaction-time">
                    {formatTimestamp(transaction.timestamp)}
                  </div>
                </div>
                <div
                  className="stock-transaction-type"
                  style={{
                    ...styles.stockTransactionType,
                    color: transaction.type === "BUY" ? "green" : "red",
                  }}
                >
                  {transaction.type}
                </div>
              </li>
            </div>
          ))}
        </div>
        <div className="stock-notifications" style={styles.stockNotifications}>
          {notifications.map((notification) => (
            <li key={notification} style={styles.stockNotification}>
              {notification}
            </li>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = days[date.getUTCDay()];
  const dayOfMonth = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${day}, ${dayOfMonth} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;
}
