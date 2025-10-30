import axios from "axios"
import "dotenv/config"

export const profile = async (req, res) => {
    const { ticker } = req.query
    try {
        const response = await axios.get(`https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules`, {
            params: {
                ticker: ticker,
                module: 'asset-profile'
            },
            headers: {
                'x-rapidapi-key': process.env.YH_API,
                'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
            }
        })

        res.status(200).json(response.data)
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
}

export const incomeStatement = async (req, res) => {
    const { ticker } = req.query
    try {
        const response = await axios.get(`https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules`, {
            params: {
                ticker: ticker,
                module: 'income-statement'
            },
            headers: {
                'x-rapidapi-key': process.env.YH_API,
                'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
            }
        })

        res.status(200).json(response.data)
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
}

export const balanceSheet = async (req, res) => {
    const { ticker } = req.query
    try {
        const response = await axios.get(`https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules`, {
            params: {
                ticker: ticker,
                module: 'balance-sheet'
            },
            headers: {
                'x-rapidapi-key': process.env.YH_API,
                'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
            }
        })

        res.status(200).json(response.data)
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
}



export const recommendation = async (req, res) => {
    const { ticker } = req.query
    try {
        const response = await axios.get(`https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules`, {
            params: {
                ticker: ticker,
                module: 'recommendation-trend'
            },
            headers: {
                'x-rapidapi-key': process.env.YH_API,
                'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
            }
        })

        res.status(200).json(response.data)
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
}

export const insider = async (req, res) => {
    const { ticker } = req.query
    try {
        const response = await axios.get(`https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules`, {
            params: {
                ticker: ticker,
                module: 'insider-transactions'
            },
            headers: {
                'x-rapidapi-key': process.env.YH_API,
                'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
            }
        })

        res.status(200).json(response.data)
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
}

export const earnings = async (req, res) => {
    const { ticker } = req.query
    try {
        const response = await axios.get(`https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules`, {
            params: {
                ticker: ticker,
                module: 'earnings'
            },
            headers: {
                'x-rapidapi-key': process.env.YH_API,
                'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
            }
        })

        res.status(200).json(response.data)
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
}