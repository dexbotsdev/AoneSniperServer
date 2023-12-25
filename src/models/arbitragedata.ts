// @/models.ts
import { prop, getModelForClass } from "@typegoose/typegoose";

export class ArbitrageData {
    @prop()
    public buyPrice!: number;
  
    @prop()
    public   profit!: number;
    @prop()
    public sellAtExchange!: string;
    @prop()
    public sellPrice!: number;
    @prop()
    public symbol!: string;
    @prop()
    public timestamp!: number;
}

export const ArbitrageDataModel = getModelForClass(ArbitrageData);