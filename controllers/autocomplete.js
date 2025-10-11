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
                    'x-rapidapi-key': '0c8b8a1248msh05791a5363eb7a7p12b41ajsne1bcf2853fb7',
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