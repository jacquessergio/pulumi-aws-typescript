import * as mongoose from "mongoose";

export class MgConnection {

    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    public connect() {
        mongoose.connect(this.url, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => {
            console.log('connected to database')
        })
    }

    public disconnect() {
        mongoose.disconnect();
    }
}

