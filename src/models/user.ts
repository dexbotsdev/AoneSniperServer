// @/models.ts
import { prop, getModelForClass } from "@typegoose/typegoose";
import { randomBytes } from "crypto";

export class UserData {
    @prop()
    public userId: string ='userId_1'; 
    @prop()
    public firstname!: string;
    @prop()
    public emailId!: string;
    @prop()
    public vaultKey: string= randomBytes(16).toString('hex');
}

export const UserDataModel = getModelForClass(UserData);