import { Router } from "express";
 import { clerkClient } from '@clerk/clerk-sdk-node';
import   {ArbitrageDataModel}   from "../models/arbitragedata";
 var ArbitrageRoutes = Router();

ArbitrageRoutes.get("/", async function (req: any, res, next) { 

    try {
 

        if (!req.auth.userId) {
            res.status(401).send("Please log in")
            return;
        } 
        console.log(await clerkClient.users.getUser(req.auth.userId)); 
        const arbitrageData = await ArbitrageDataModel.find();
        console.log('New Data');
        console.log(arbitrageData);
        console.log(new Date(arbitrageData[1].timestamp).toLocaleTimeString())
        let arbData = arbitrageData.filter((item: { symbol: string | string[]; }) => item.symbol.indexOf('3LUSDT') == -1);
        arbData = arbData.filter((item: { symbol: string | string[]; }) => item.symbol.indexOf('3SUSDT') == -1);

        console.log(arbData.length);
        res.send(arbData.slice(0, 10).sort());
    } catch (Error) {
        console.log(Error);


        res.status(401).send("Please log in")
        return;
    }
});

export default ArbitrageRoutes;


