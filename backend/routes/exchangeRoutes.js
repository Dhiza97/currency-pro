import express from 'express'
import { getRates } from '../services/exchangeService.js'
import { getCache, setCache } from '../utils/cache.js'

const router = express.Router()

router.get("/:base", async (req, res) => {
    try {
        const data = await getRates(req.params.base)
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get all available currencies
router.get("/", async (req, res) => {
    try {
        // Try to get from cache first
        let currencies = await getCache("all_currencies");
        
        if (!currencies) {
            // Fetch from API using USD as base (most common)
            const data = await getRates("USD");
            currencies = Object.keys(data.rates).map(code => ({
                code,
                name: getCurrencyName(code)
            })).sort((a, b) => a.code.localeCompare(b.code));
            
            // Cache for 24 hours
            await setCache("all_currencies", currencies, 86400);
        }
        
        res.json({ success: true, currencies });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Helper function for currency names
const getCurrencyName = (code) => {
    const names = {
        USD: "US Dollar", EUR: "Euro", GBP: "British Pound", JPY: "Japanese Yen",
        CNY: "Chinese Yuan", INR: "Indian Rupee", AUD: "Australian Dollar", CAD: "Canadian Dollar",
        CHF: "Swiss Franc", HKD: "Hong Kong Dollar", SGD: "Singapore Dollar", SEK: "Swedish Krona",
        KRW: "South Korean Won", NOK: "Norwegian Krone", NZD: "New Zealand Dollar", MXN: "Mexican Peso",
        BRL: "Brazilian Real", ZAR: "South African Rand", RUB: "Russian Ruble", TRY: "Turkish Lira",
        NGN: "Nigerian Naira", AED: "UAE Dirham", SAR: "Saudi Riyal", THB: "Thai Baht",
        MYR: "Malaysian Ringgit", PHP: "Philippine Peso", IDR: "Indonesian Rupiah", VND: "Vietnamese Dong",
        PKR: "Pakistani Rupee", BDT: "Bangladeshi Taka", EGP: "Egyptian Pound", KES: "Kenyan Shilling",
        GHS: "Ghanaian Cedi", TZS: "Tanzanian Shilling", UGX: "Ugandan Shilling", MAD: "Moroccan Dirham"
    };
    return names[code] || code;
};

export default router