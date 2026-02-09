"use client";

import { useEffect, useRef, useState } from "react";

// Free Binance WebSocket URL
const WS_BASE = "wss://stream.binance.com:9443/ws";

// Helper to convert IDs (bitcoin) to Binance symbols (btcusdt)
const getBinanceSymbol = (id: string) => {
  const map: Record<string, string> = {
    bitcoin: "btcusdt",
    ethereum: "ethusdt",
    solana: "solusdt",
    cardano: "adausdt",
    ripple: "xrpusdt",
  };
  return map[id] || `${id}usdt`; // fallback
};

export const useCoinGeckoWebSocket = ({
  coinId,
  liveInterval = "1s", // Default to 1h candles
}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
  const wsRef = useRef<WebSocket | null>(null);
  const currentSymbol = useRef<string | null>(null);

  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
  const [isWsReady, setIsWsReady] = useState(false);

  // 1. Initialize Connection (Run Once)
  useEffect(() => {
    const ws = new WebSocket(WS_BASE);
    wsRef.current = ws;

    const handleMessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);

      // Handle Ticker Data (Simulating CoinGecko 'C1' Price updates)
      // Binance Event: "24hrTicker"
      if (msg.e === "24hrTicker") {
        setPrice({
          usd: parseFloat(msg.c), // Current price
          coin: msg.s, // Symbol
          price: parseFloat(msg.c),
          change24h: parseFloat(msg.P), // 24h percent change
          marketCap: 0, // Binance doesn't stream MC
          volume24h: parseFloat(msg.v),
          timestamp: msg.E,
        });
      }

      // Handle Trade Data (Simulating CoinGecko 'G2' Trades)
      // Binance Event: "trade"
      if (msg.e === "trade") {
        const newTrade: Trade = {
          price: parseFloat(msg.p),
          value: parseFloat(msg.p) * parseFloat(msg.q),
          timestamp: msg.T,
          type: msg.m ? "sell" : "buy", // 'm' is isBuyerMaker
          amount: parseFloat(msg.q),
        };
        // Keep last 15 trades
        setTrades((prev) => [newTrade, ...prev].slice(0, 15));
      }

      // Handle OHLCV Data (Simulating CoinGecko 'G3' Candles)
      // Binance Event: "kline"
      if (msg.e === "kline") {
        const k = msg.k;
        const candle: OHLCData = [
          k.t, // Timestamp
          parseFloat(k.o), // Open
          parseFloat(k.h), // High
          parseFloat(k.l), // Low
          parseFloat(k.c), // Close
          parseFloat(k.v), // Volume
        ];
        setOhlcv(candle);
      }
    };

    ws.onopen = () => setIsWsReady(true);
    ws.onmessage = handleMessage;
    ws.onclose = () => setIsWsReady(false);
    ws.onerror = (error) => {
      // console.error('Binance WS Error:', error);
      setIsWsReady(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  // 2. Manage Subscriptions (Runs when coinId changes)
  useEffect(() => {
    if (!isWsReady || !wsRef.current) return;

    const symbol = getBinanceSymbol(coinId);
    const ws = wsRef.current;

    // Helper to send payloads safely
    const send = (payload: Record<string, unknown>) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
      }
    };

    // If we were subscribed to a different coin, unsubscribe first
    if (currentSymbol.current && currentSymbol.current !== symbol) {
      const old = currentSymbol.current;
      send({
        method: "UNSUBSCRIBE",
        params: [`${old}@ticker`, `${old}@trade`, `${old}@kline_${liveInterval}`],
        id: 1,
      });
      // Clear data when switching coins
      setPrice(null);
      setTrades([]);
    }

    // Subscribe to new coin streams
    // We grab 3 streams: Ticker (for 24h stats), Trade (for list), Kline (for chart)
    send({
      method: "SUBSCRIBE",
      params: [`${symbol}@ticker`, `${symbol}@trade`, `${symbol}@kline_${liveInterval}`],
      id: 2,
    });

    currentSymbol.current = symbol;

    // Cleanup on unmount (optional, but good practice)
    return () => {
      // We generally leave the socket open, but could unsubscribe here if needed
    };
  }, [coinId, isWsReady, liveInterval]);

  return {
    price,
    trades,
    ohlcv,
    isConnected: isWsReady,
  };
};
