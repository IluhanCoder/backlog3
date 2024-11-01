"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const router_1 = __importDefault(require("./router"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_middleware_1 = __importDefault(require("./auth/auth-middleware"));
const auth_controller_1 = __importDefault(require("./auth/auth-controller"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = 5001;
const conn = process.env.DB_CONN;
const clientUrl = process.env.CLIENT_URL;
mongoose_1.default.connect(conn);
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: clientUrl,
}));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post("/login", auth_controller_1.default.login);
app.post("/registration", auth_controller_1.default.registration);
app.post("/verify", auth_controller_1.default.verifyToken);
app.use(auth_middleware_1.default);
app.use(router_1.default);
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map