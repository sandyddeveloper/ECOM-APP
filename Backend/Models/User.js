import mongoose, { Types } from "mongoose";

const schema = mongoose.Schema(
    {
        name : {
            Type : String,
            require : true,
        },

        email : {
            Type : String,
            require : true,
            unique : true,
        },

        password : {
            Type : String,
            require : true,
        },

        contact : {
            Typ : String,
            require : true,
        },

        role : {
            Type : String,
        }
    },
    {
        timestamps : true
    },
);


export const User = mongoose.Model ("User", schema);