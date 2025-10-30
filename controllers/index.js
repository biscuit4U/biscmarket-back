import axios from "axios"
import "dotenv/config"

export const index = async (req, res) => {
    const { symbol, interval } = req.query
    console.log(symbol)

    if (!symbol) {
        return res.status(400).json({ message: "Stock symbol is required" })
    }

    const getLimitByInterval = (interval) => {
        switch (interval) {
            case "5m": return 78;    // 1 trading day
            case "30m": return 26;   // 1 trading day
            case "1h": return 100;    // ~2.5 trading days
            case "1d": return 180;    // 3 months
            case "1wk": return 220;   // 1 year
            case "1mo": return 1000;   // 2 years
            case "1qty": return 640;  // 4 years
            default: return 100;
        }
    };
    try {
        const response = await axios.get(
            'https://yahoo-finance15.p.rapidapi.com/api/v2/markets/stock/history',
            {
                params: {
                    symbol: symbol,
                    interval: interval ? interval : "5m",
                    limit: getLimitByInterval(interval)
                },
                headers: {
                    'x-rapidapi-key': process.env.YH_API,
                    'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
                }
            }
        )

        console.log(response)
        res.status(200).json(response.data)
    } catch (error) {
        console.error('Yahoo Finance API error:', error.message)

        if (error.response?.status === 404) {
            return res.status(404).json({ message: "Stock symbol not found" })
        }

        if (error.code === 'ENOTFOUND') {
            return res.status(503).json({ message: "Service unavailable" })
        }

        res.status(500).json({ message: "Internal server error" })
    }
}