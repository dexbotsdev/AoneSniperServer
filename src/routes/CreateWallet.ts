import { Router } from "express";
 import { clerkClient } from '@clerk/clerk-sdk-node';
import { UserDataModel } from "../models/user";
import { WalletDataModel } from "../models/wallet";

import { ethers, utils } from 'ethers';
import { pbkdf2Sync, randomBytes } from "crypto";

export function getWallet(salt: any,walletName: any ,password:  any ) {
 
  const iterations = 10000; // Number of iterations for PBKDF2
   // Derive a key using PBKDF2
  const derivedKewalletNamey = pbkdf2Sync(walletName, salt, iterations, 32, 'sha256');
  const derivedKewalletNamey2 = pbkdf2Sync(password, derivedKewalletNamey, iterations, 32, 'sha256'); 
  // Concatenate and hash the wallet name, derived key, and salt to create a deterministic key
  const combinedData = derivedKewalletNamey.toString('hex') + derivedKewalletNamey2.toString('hex');
  const bufferValue = Buffer.from(combinedData, 'hex'); 
  const generatedPrivateKey = utils.sha256(bufferValue); 
  return generatedPrivateKey; 
}


var CreateWalletRoutes = Router();

 
  CreateWalletRoutes.post("/", async function (req: any, res, next) { 

    try {
 
        if (!req.auth.userId) {
            res.status(401).send("Please log in")
            return;
        } 
       const user = await clerkClient.users.getUser(req.auth.userId); 
       const localUser = await UserDataModel.findOne({userId:req.auth.userId}).exec();
      const vaultKey = randomBytes(16).toString('hex');  
       const name = req.body.walletName;

       let walletOld = await WalletDataModel.findOne({walletName:name}).exec();

       if(!walletOld && localUser){
        console.log(vaultKey,name,req.body.walletPassword);

        const generatedPrivateKey = getWallet(vaultKey,name,req.body.walletPassword);

        const wallet = new ethers.Wallet(generatedPrivateKey);

        console.log(wallet);
         walletOld = await WalletDataModel.create({
            walletName: name,
            walletPassword: req.body.walletPassword, 
            address: wallet.address, 
            vaultKey:vaultKey,
            enabled:true
         })
       } else {
        res.status(403).send("Duplicated Name")
        return;
       }

        res.send(walletOld);
    } catch (Error) {
        console.log(Error); 

        res.status(401).send("Please log in")
        return;
    }
});

export default CreateWalletRoutes;


