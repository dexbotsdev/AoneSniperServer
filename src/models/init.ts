import fs = require("fs");
import mongoose = require('mongoose');
import path = require("path");
const normalizedPath = path.join(__dirname, "entities");

 
export class DB {
    public static connect(db: string) {
        mongoose.connect('mongodb://127.0.0.1:27017/MultiDexArbitrage?authSource=admin').then((_) => {
            console.log(`Connection to DB(${db}) succesful !`);
        }).catch((err) => {
            console.error(err);
            process.exit();
        });
    }
}
