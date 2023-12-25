import { Router } from "express";
 import { clerkClient } from '@clerk/clerk-sdk-node';
import { UserDataModel } from "../models/user";
import { randomBytes } from "crypto";
import { WalletDataModel } from "../models/wallet";
  var GetNewWallets = Router();

  GetNewWallets.get("/", async function (req: any, res, next) { 

    try {
 
        if (!req.auth.userId) {
            res.status(401).send("Please log in")
            return;
        } 
       const user = await clerkClient.users.getUser(req.auth.userId);
       let localUser = await UserDataModel.findOne({userId:req.auth.userId}).exec();
        let wallets;
       console.log(user);
       console.log(localUser);

       if(localUser){
            console.log('Get all my wallets ')

           wallets = (await WalletDataModel.find({vaultKey:localUser.vaultKey})).map(item=> {
            return {
                walletName: item.walletName,
                vaultKey : item.vaultKey,
                address: item.address
            }
           })
        }

        res.send(wallets);
    } catch (Error) {
        console.log(Error); 

        res.status(401).send("Please log in")
        return;
    }
});

export default GetNewWallets;


