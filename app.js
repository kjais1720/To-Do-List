// jshint esversion : 6

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const _ = require('lodash');


// Setting up Database connection
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/todolist',{useNewUrlParser:true, useUnifiedTopology: true} );
mongoose.connect("mongodb+srv://kjais1720:8271@db@cluster1.e9kli.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.set('useFindAndModify', false);


//Setting up datatbase schema
const toDoSchema ={
    name: {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    }
}

const listSchema = {
    name: String,
    items: [toDoSchema]
}


//Creating models
const List = mongoose.model('List', listSchema);
const generalTask = mongoose.model('generalTask', toDoSchema);

//Default items that will be added to the database
defaultItem1 = new generalTask({
    name: "Buy Groceries",
    status: "Not Completed"
});

defaultItem2 = new generalTask({
    name: "Yoga",
    status: "Not Completed"
});

defaultItem3 = new generalTask({
    name: "Buy books",
    status: "Not Completed"
});

let defaultItems=[defaultItem1,defaultItem2,defaultItem3];


app.use(bodyParser.urlencoded({extended:true}));

//serve css file
app.use(express.static('views'));

app.set('view engine', 'ejs');
const port = process.env.PORT || 3000;


// Routers 


app.get('/',(req,res)=>{
    generalTask.find({},(err,foundItems)=>{
        if  (foundItems.length === 0) {
            generalTask.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('lists',{typeOfList:'General tasks',items : foundItems})
                }
            });            
        }
        else {
            res.render('lists',{typeOfList:'General tasks',items : foundItems})
        }
    })
});


app.get('/:newRoute',(req,res)=>{
    const newRoute = _.capitalize(req.params.newRoute);
    List.findOne({name:newRoute},(err,foundItem)=>{
        if (!foundItem){
            //Create a list
            const list = new List({
                name: newRoute,
                items: defaultItems
            })
            list.save();
            res.redirect(`/${newRoute}`);
        } else{
            //Show an existing list
            res.render('lists',{typeOfList:newRoute,items : foundItem.items})
        }
    })

    
})

app.post('/',(req,res)=>{
    const typeOfList = req.body.button;
    console.log(typeOfList);
    todoItem = new generalTask({
        name: req.body.job,
        status: 'Not Completed'
    })

    if(req.body.job){
        if (req.body.button === 'General tasks'){
            console.log('inside regular')
            todoItem.save();
            res.redirect('/')
        } else{
            List.findOne({name:typeOfList},(err,foundItem)=>{
                if (err) console.log(err)
                else{
                    foundItem.items.push(todoItem);
                    foundItem.save()
                    res.redirect('/'+typeOfList);
                }
            })
        }
    }
    else{
        res.redirect('/');
    }
})

app.post('/delete',(req,res)=>{
    let taskId = req.body.taskId;
    let listName = req.body.listName;    
    if(listName==="General tasks"){
        generalTask.deleteOne({_id:taskId},(err,deletedItem)=>{
            if (!err) {
                console.log(err);
                res.redirect('/')
            }
        })
    } else {
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:taskId}}},(err,foundList)=>{
            if (err) console.log(err);
            else res.redirect('/'+listName);
        })
    }
})


app.listen(port,()=>{
    console.log("Server started running on https://localhost:"+port);
})
