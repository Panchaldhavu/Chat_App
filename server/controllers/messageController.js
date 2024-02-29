const messageModel = require("../models/messageModel")


module.exports.addMsg = async (req, res, next) => {
    try {
        const {from , to ,message} = req.body
        const data = await messageModel.create({
            message:{text : message},
            users : [from ,to],
            sender : from
        })
        if(data){
            return res.json({message : "Message added successfully"})
        }else {
            return res.json({message :"Fail to add message to the database"})
        }
    } catch (error) {
        next(error)
    }
}



module.exports.getAllMsg = async (req, res, next) => {
    try {
        const {from ,to } = req.body
        const messages = await messageModel.find({
            users :{
                $all :[from,to],

            }
        }).sort({updatedAt : 1})

        const ProjectMessages = messages.map((msg) =>{
            return {
                fromSelf :msg.sender.toString() === from ,
                message : msg.message.text
            }
        })

        res.json(ProjectMessages)

    } catch (error) {
        next(error)
    }
}