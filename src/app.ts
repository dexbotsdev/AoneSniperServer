import express = require("express");
import { logEnd, logStart } from "./express-logger"; 
import bodyParser = require('body-parser');
import ArbitrageRoutes from "./routes/ArbitrageData";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import { setClerkApiKey } from "@clerk/clerk-sdk-node";

import 'dotenv/config'; // To read CLERK_SECRET_KEY
import clerk from '@clerk/clerk-sdk-node';
import MeRouter from "./routes/MeRouter";
import CreateWalletRoutes from "./routes/CreateWallet";
import GetNewWallets from "./routes/GetNewWallets";
import withdrawAmount from "./routes/withdrawAmount";

const app = express();
setClerkApiKey('sk_test_jN8nAKdYy5zLzIASeQteioYYPZYmdVim7TuHz9aKPI')


// Logging
app.use((req, res, next) => {
    const hrStart = logStart(req, res);
    res.on('finish', () => logEnd(req, res, hrStart));
    next();
}); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use("/api/v1/createNewWallet", ClerkExpressWithAuth({ 
}), CreateWalletRoutes);
app.use("/api/v1/getNewWallets", ClerkExpressWithAuth({ 
}), GetNewWallets); 
app.use("/api/v1/arbitrageData", ClerkExpressWithAuth({ 
}), ArbitrageRoutes); 
app.use("/me", ClerkExpressWithAuth({ 
}), MeRouter); 
app.use("/api/v1/withdrawAmount", ClerkExpressWithAuth({ 
}), withdrawAmount); 

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const status = err.status || 500;
    let errMsg: any = {
        message: 'Unkown error',
        status,
    };
    if (err instanceof Error) {
        errMsg = {
            ...errMsg,
            message: err.message,
            stack: err.stack,
        };
    }
    res.status(status).json(errMsg);
});

export default app;
