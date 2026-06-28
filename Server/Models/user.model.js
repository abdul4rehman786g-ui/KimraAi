import mongoose, { trusted } from "mongoose";

const pageSchema = new mongoose.Schema({
  name: String,

  path: String,

  keywords:{
    type:[String],

    default:[],
  },
},
  {_id:false}
)

const userSchema=new mongoose.Schema({
    name:{
      type:String,
      required:true
    },

    email:{
      type:String,
      required:true,
      unique:true
    },

    assistantName:{
      type:String,
      default:"Kimra"
    },

    businessName:{
      type:String,
      default:""
    },
   businessType:{
    type:String,
    default:""
   },
   businessDescription:{
    type:String,
    default:""
   },

   tone:{
    type:String,
    enum:[
      "friendly",
      "professional",
      "sales",
    ],
    default:"friendly"
   },

   theme:{
    type:String,
    enum:[
      "light",
      "dark",
      "glass",
      "neon",
    ],

    default:"neon"
   },

   enableVoice:{
    type:Boolean,
    default:true 
   },

   pages:{
    type:[pageSchema],
    defualt:[]
   },

   enableNavigation:{
    type:Boolean,
    default:true
   },

   geminiApiKey:{
    type:String,
    default:""
   },

   geminiStatus:{
    type:String,
    enum:[
      "active",
      "quota_exceeded",
      "invalid",
    ],
    default:"active"
   },

   totalMessages:{
    type:Number,
    default:0
   },

   plan:{
    type:String,
    default:"free"
   },

   requestLimit:{
    type: Number,
    default:200,
   },

   isSetupComplete:{
     type:Boolean,
     default:false
   },




},{timestamps:true})

const User=mongoose.model("User",userSchema)

export default User

