"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const supabase_js_1 = require("@supabase/supabase-js");
const facebookRoutes_1 = __importDefault(require("./routes/facebookRoutes"));
const scheduler_1 = require("./utilities/scheduler");
const keys_1 = require("./keys");
const keys_2 = require("./keys");
const keys_3 = require("./keys");
const keys_4 = require("./keys");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: keys_1.APP_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true, // Set to true if using HTTPS
        maxAge: 60000 // Adjust as needed
    }
}));
app.use("/", facebookRoutes_1.default);
(0, scheduler_1.scheduler)();
exports.supabase = (0, supabase_js_1.createClient)(`${keys_2.DATABASE_URL}`, `${keys_3.PUBLIC_KEY}`);
const checkConnection = async () => {
    const { error } = await exports.supabase.from("users").select("id").limit(1);
    if (error) {
        console.error("Failed to connect to Supabase:", error.message);
        process.exit(1);
    }
    else {
        console.log("Successfully connected to Supabase");
    }
};
checkConnection();
app.get("/", (request, response) => {
    response.send("Server Hosted Successfully");
});
app.listen(keys_4.PORT, () => {
    console.log(`server running on Port ${keys_4.PORT}`);
});
