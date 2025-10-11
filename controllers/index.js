import axios from "axios"
import "dotenv/config"

export const index = async (req, res) => {
    const { symbol, interval } = req.query

    if (!symbol) {
        return res.status(400).json({ message: "Stock symbol is required" })
    }

    try {
        const response = await axios.get(
            `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history?symbol=${symbol}&interval=5m&diffandsplits=true`,
            {
                params: {
                    symbol: symbol,
                    diffandsplits: 'false',
                    interval: interval ? interval : "5m"
                },
                headers: {
                    'x-rapidapi-key': process.env.YH_API,
                    'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
                }
            }
        )

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