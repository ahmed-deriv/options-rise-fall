import { useEffect, useState } from "react";
import { DerivAPIService } from "../services/deriv-api.service";
import { ActiveSymbolsResponse } from "../types/deriv-api.types";

const APP_ID = import.meta.env.VITE_DERIV_APP_ID || "";

export const DerivTrading = () => {
  const [symbols, setSymbols] = useState<
    ActiveSymbolsResponse["active_symbols"]
  >([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const derivAPI = new DerivAPIService({ app_id: APP_ID });
    const initializeAPI = async () => {
      try {
        const response = await derivAPI.getActiveSymbols();
        setSymbols(response.active_symbols);

        // Subscribe to a sample symbol (R_100)
        const res = await derivAPI.subscribeTicks("R_100");
        console.log(res, "www");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize Deriv API"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (APP_ID) {
      initializeAPI();
    } else {
      setError(
        "Please provide VITE_DERIV_APP_ID in your environment variables"
      );
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      derivAPI.disconnect();
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Available Trading Symbols</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {symbols.map((symbol) => (
          <div
            key={symbol.symbol}
            style={{
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <h3>{symbol.display_name}</h3>
            <p>Market: {symbol.market_display_name}</p>
            <p>Submarket: {symbol.submarket_display_name}</p>
            <p>
              Status:{" "}
              <span
                style={{ color: symbol.exchange_is_open ? "green" : "red" }}
              >
                {symbol.exchange_is_open ? "Open" : "Closed"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
