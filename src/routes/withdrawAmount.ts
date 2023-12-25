import { Router } from "express";
import { clerkClient } from '@clerk/clerk-sdk-node';
import { UserDataModel } from "../models/user";
import { WalletDataModel } from "../models/wallet";

import { ethers, utils } from 'ethers';
import { pbkdf2Sync } from "crypto";
import { formatEther, parseEther } from "ethers/lib/utils";

export function getWallet(salt: any, walletName: any, password: any) {

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


var withdrawAmount = Router();


withdrawAmount.post("/", async function (req: any, res, next) {

    try {
 

        if (!req.auth.userId) {
            res.status(401).send("Please log in")
            return;
        }
        const localUser = await UserDataModel.findOne({ userId: req.auth.userId }).exec();

        const name = req.body.walletName;
        const toAddress = req.body.toAddress;
        const amount = req.body.amount;
        console.log('User Saved  wallet is ' + name);

        console.log('Requested wallet is ' + toAddress);
        console.log('Requested localUser is ' + localUser);

        if (localUser) {

            let walletExists = await WalletDataModel.findOne({ walletName: name, vaultKey: localUser?.vaultKey }).exec();

            let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER);
            if (walletExists) {
                console.log(localUser.vaultKey, walletExists.walletName, walletExists.walletPassword);

                const generatedPrivateKey = getWallet(localUser.vaultKey, name, walletExists.walletPassword);

                const wallet = new ethers.Wallet(generatedPrivateKey,provider);

                console.log('Requested wallet is ' + toAddress);
                console.log('User Saved  wallet is ' + wallet.address);

                const balancePresent = await wallet.getBalance();


                console.log('Wallet has Balance of ' + balancePresent.toString());


                if (Number(amount) > Number(formatEther(balancePresent.toString()))) {
                    res.status(500).send("Requested Amount Exceeds balance")
                    return;
                }


                const hash = await wallet.sendTransaction({
                    to: toAddress,
                    value: parseEther(""+amount)
                }).then(Transaction => {

                    return Transaction.hash;
                })

                res.send(hash);

            }


        } else {
            res.status(403).send("Invalid Wallet Name")
            return;
        }

    } catch (Error) {
        console.log(Error);

        res.status(401).send("Please log in")
        return;
    }
});

export default withdrawAmount;


