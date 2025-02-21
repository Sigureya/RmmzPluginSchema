import { Struct } from "./struct";

interface Parson{
    name: string;
    age: number;
    isStudent: boolean;
}

interface Home{
    address: string;
    rooms: number;
    family: Parson[];
}

const parson: Struct<Parson> = {
    structName: "Parson",
    params: {
        name: {
            type: "string",
            default: "John Doe",
        },
        age: {
            type: "number",
            default: 0,
        },
        isStudent: {
            type: "boolean",
            default: false,
        },
    },
};
const HOME: Struct<Home> = {
    structName: "Home",
    params: {
        address: {
            type: "string",
            default: "123 Main St",
        },
        rooms: {
            type: "number",
            default: 1,
        },
        family: {
            type: "struct[]",
            struct: parson,
            default: [],
        },
    },
};

const func =( home:Struct<Home>)=>{
   if( home.params.address.type ==="select"){
        home.params.address.options=[]
   }
}