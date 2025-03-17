"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
(0, dotenv_1.config)();
const port = process.env.PORT;
app.get("/", (req, res) => {
    res.send("hello world");
});
app.listen(port, () => console.log(`Server started listening at http://localhost:${port}`));
//# sourceMappingURL=app.js.map