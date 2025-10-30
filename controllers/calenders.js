import axios from "axios";
import "dotenv/config"
export const calenders = async (req, res) => {
    const today = new Date().getTime();
    const week = new Date(today + (1000 * 60 * 60 * 24 * 5)).getTime()

    try {
        const response = await axios.get(`https://yahoo-finance166.p.rapidapi.com/api/calendar/get-events`,
            {
                params: {
                    modules: 'ipoEvents,earnings,secReports,economicEvents',
                    countPerDay: '30',
                    start_date: today,
                    end_date: week
                },
                headers: {
                    'x-rapidapi-key': process.env.YH_API,
                    'x-rapidapi-host': 'yahoo-finance166.p.rapidapi.com'
                }
            }
        )
        res.status(200).json(response.data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error" })
    }
}