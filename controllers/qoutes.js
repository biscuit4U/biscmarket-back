import "dotenv/config"
import axios from "axios"
import { qoutesArray } from "../utils/qoutes.js"

export const qoutes = async (req, res) => {
    console.log('qoutes: ')
    const qoutes = [...qoutesArray].join(',')
    try {
        const response = await axios.get(
            `https://yahoo-finance166.p.rapidapi.com/api/market/get-quote?symbols=${qoutes}`,
            {
                headers: {
                    'x-rapidapi-key': process.env.YH_API,
                    'x-rapidapi-host': 'yahoo-finance166.p.rapidapi.com'
                }
            }
        )
        console.log(response.data)
        res.status(200).json(response.data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error" })
    }
}