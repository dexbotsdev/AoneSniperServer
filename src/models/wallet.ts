// @/models.ts
import { prop, getModelForClass } from "@typegoose/typegoose";

export class WalletData {
    @prop()
    public walletName: string ='MyWallet'; 
    @prop()
    public   walletPassword!: string;
    @prop()
    public   pk!: string;
    @prop()
    public   address!: string; 
    @prop()
    public   vaultKey!: string; 
    @prop()
    public enabled: boolean= true; 
}

export const WalletDataModel = getModelForClass(WalletData);