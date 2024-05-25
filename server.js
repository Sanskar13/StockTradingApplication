const express = require("express");
const { Server } = require("socket.io");

const app = express();
const PORT = 3002;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const users = {};
const symbolSocketsMap = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  users[socket.id] = {
    socketId: socket.id,
    balance: 100000,
    transactions: [],
    subscribedSymbols: new Set(),
  };

  socket.emit("balanceUpdate", users[socket.id].balance);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    users[socket.id].subscribedSymbols.forEach((symbol) => {
      if (symbolSocketsMap[symbol]) {
        symbolSocketsMap[symbol] = symbolSocketsMap[symbol].filter(
          (s) => s !== socket.id
        );
      }
    });

    delete users[socket.id];
  });

  socket.on("subscribeSymbol", (symbol) => {
    users[socket.id].subscribedSymbols.add(symbol);

    if (!symbolSocketsMap[symbol]) {
      symbolSocketsMap[symbol] = [];
    }
    symbolSocketsMap[symbol].push(socket.id);
  });

  socket.on("unsubscribeSymbol", (symbol) => {
    users[socket.id].subscribedSymbols.delete(symbol);

    if (symbolSocketsMap[symbol]) {
      symbolSocketsMap[symbol] = symbolSocketsMap[symbol].filter(
        (s) => s !== socket.id
      );
    }
  });

  socket.on("buy", ({ symbol, quantity, totalCost, currentStockPrice }) => {
    if (users[socket.id].balance < totalCost) {
      socket.emit("insufficientFunds", users[socket.id].balance);

      io.to(socket.id).emit("transactionResult", {
        stock_name: "N/A",
        stock_symbol: symbol,
        transaction_price: 0,
        timestamp: new Date().toISOString(),
        status: "Failed",
      });

      return;
    }

    users[socket.id].balance -= totalCost;

    const transactions = {
      stock_name: "Sample Stock", // Adjust this according to your logic
      stock_symbol: symbol,
      transaction_price: currentStockPrice,
      timestamp: new Date().toISOString(),
      status: "Success",
    };

    const transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: "BUY",
      quantity,
      timestamp: new Date().toISOString(),
    };
    users[socket.id].transactions.unshift(transaction);

    socket.emit("balanceUpdate", users[socket.id].balance);
    io.to(socket.id).emit("transactionHistory", users[socket.id].transactions);

    if (symbolSocketsMap[symbol]) {
      symbolSocketsMap[symbol].forEach((s) => {
        io.to(s).emit(
          "liveNotification",
          `${generateRandomName()} bought ${quantity} stocks of ${symbol} ${new Date().toLocaleTimeString()}`
        );
      });
    }

    io.to(socket.id).emit("transactionResult", transactions);
  });

  socket.on("sell", ({ symbol, quantity, totalCost, currentStockPrice }) => {
    users[socket.id].balance += totalCost;

    const transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: "SELL",
      quantity,
      timestamp: new Date().toISOString(),
    };
    users[socket.id].transactions.unshift(transaction);
    socket.emit("balanceUpdate", users[socket.id].balance);
    io.to(socket.id).emit("transactionHistory", users[socket.id].transactions);

    if (symbolSocketsMap[symbol]) {
      symbolSocketsMap[symbol].forEach((s) => {
        io.to(s).emit(
          "liveNotification",
          `VeerBhadra sold ${quantity} stocks of ${symbol} ${new Date().toLocaleTimeString()}`
        );
      });
    }
  });
});

function generateRandomName() {
  const nouns = ["Khumbkaran", "Bibhisan", "Lankesh", "Veerbhadra", "Ravan"];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${noun}`;
}
