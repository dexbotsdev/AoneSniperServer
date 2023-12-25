import { Router } from "express";
 import { clerkClient } from '@clerk/clerk-sdk-node';
import { UserDataModel } from "../models/user";
import { randomBytes } from "crypto";
  var MeRoutes = Router();

  MeRoutes.get("/", async function (req: any, res, next) { 

    try {
 
        if (!req.auth.userId) {
            res.status(401).send("Please log in")
            return;
        } 
       const user = await clerkClient.users.getUser(req.auth.userId);
       let localUser = await UserDataModel.findOne({userId:req.auth.userId}).exec();

       console.log(user);
       console.log(localUser);

       if(!localUser){
            console.log('Create a new usere here ')

            localUser = await UserDataModel.create({
                userId:user.id,
                firstname: user.firstName,
                emailId: user.emailAddresses[0].emailAddress 
            })
        }

        res.send(localUser);
    } catch (Error) {
        console.log(Error); 

        res.status(401).send("Please log in")
        return;
    }
});

export default MeRoutes;


