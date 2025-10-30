import axios from "axios"
import "dotenv/config"

export const movers = async (req, res) => {
    console.log('movers')
    try {
        const response = await axios.get(`https://yahoo-finance-real-time1.p.rapidapi.com/market/get-movers`,
            {
                headers: {
                    'x-rapidapi-key': process.env.YH_API,
                    'x-rapidapi-host': 'yahoo-finance-real-time1.p.rapidapi.com'
                }
            }
        )

        console.log(response.data)
        res.status(200).json(response.data)
    } catch (error) {
        console.error('Yahoo Finance API error:', error.message)

        if (error.response?.status === 429) {
            return res.status(429).json({ message: "reached api request limit" })
        }

        if (error.code === 'ENOTFOUND') {
            return res.status(503).json({ message: "Service unavailable" })
        }

        res.status(500).json({ message: "Internal server error" })
    }
}