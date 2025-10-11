import axios from "axios"
import "dotenv/config"

export const news = async (req, res) => {
    const { ticker } = req.query
    console.log(ticker)
    try {
        const response = await axios.get(`https://yahoo-finance15.p.rapidapi.com/api/v2/markets/news`, {
            params: ticker ? {
                ticker: ticker,
                type: 'ALL'
            } :
                {
                    type: 'ALL'
                },

            headers: {
                'x-rapidapi-key': process.env.YH_API,
                'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
            }
        })

        res.status(200).json(response.data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error" })
    }
}