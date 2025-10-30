import axios from "axios";
import xss from "xss";
import "dotenv/config";

export const autocomplete = async (req, res) => {
    const prefix = xss(req.body.prefix);
    console.log(prefix)

    if (!prefix) return res.status(400).json({ message: "request must have a prefix" })

    try {
        const response = await axios.get(`https://yahoo-finance15.p.rapidapi.com/api/v1/markets/search`,
            {
                params: { search: prefix },
                headers: {
                    'x-rapidapi-key': process.env.YH_API,
                    'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
                }
            }
        )

        res.status(200).json(response.data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal server error' })
    }
}