var express=require("express")
var app=express();
var mysql2=require("mysql2")
var cloudinary=require("cloudinary").v2;
var fileuploader=require("express-fileupload");
app.use(fileuploader());

app.listen(9999,function(){
    console.log("Started")
})
app.use(express.static("public"))

//cloudinary
cloudinary.config({ 
    cloud_name: 'djgzc9eeh', 
    api_key: '862419235628599', 
    api_secret: 'vzAAGh3bcHoN5pOZrLgRgGIcQic' // Click 'View API Keys' above to copy your API secret
});

//database
let config="mysql://avnadmin:AVNS_a7dO6guNcEWFfMhpa3q@mysql-2e7886c7-armaansinghmann8181-46d4.c.aivencloud.com:19063/defaultdb"
let mysqlServer=mysql2.createConnection(config);
mysqlServer.connect(function(err){
    if (err==null)
        console.log("Connected to database")
    else
    console.log(err.message)
})
//
app.get("/",function(req,resp){
    resp.sendFile(__dirname+"/public/index.html")
})


app.get("/signup",function(req,resp){
    let email=req.query.txtEmail;
    let pwd=req.query.txtPwd;
    let utype=req.query.utype;

    mysqlServer.query("insert into user(emailid,pwd,utype,status,dos) values(?,?,?,?,current_date())",[email,pwd,utype,1],function(err){
        if(err==null)
        {
            
            resp.send("Signed up Successfullyyyyy");

        }
        else
            resp.send(err.message)
    })

})

app.get("/login",function(req,resp){
    let email=req.query.txtLogid;
    let pass=req.query.txtLogPass;
    console.log(email)
    console.log(pass)
    mysqlServer.query("select * from user where emailid=? and pwd=?",[email,pass],function(err,jsonArray){
        console.log(jsonArray)
        if (jsonArray.length==1)
        {
            resp.send(jsonArray[0]["utype"])
            console.log(jsonArray[0]["status"])
        }
        else(
            resp.send("Incorrect Credenitals")
        )
})
    })
app.get("/gg",function(req,resp){
    resp.sendFile(__dirname+"/public/profileorganiser.html")
})
app.use(express.urlencoded(true))

app.post("/save", async function(req,resp){
    console.log(req.body);
    let filename="";
    if(req.files==null)//pic not uploaded
    {
        filename="nopic.jpg";
    }
    else
    {
        filename=req.files.txtprooffile.name;
        let path=__dirname+"/public/images/"+filename;
        console.log(path);
        req.files.txtprooffile.mv(path);//to movethe uploaded file at req path
            
        await cloudinary.uploader.upload(path).then(function(result){
        filename=result.url;
        console.log(filename);
     });
    }
       req.body.txtprooffile=filename; //new name-value pair added in body at runtime
       //save data acc to columns in seq in aiven vala database
       console.log(req.body)
       mysqlServer.query("insert into organisation values(?,?,?,?,?,?,?,?,?,?,?)",[req.body.txtmail,req.body.txtorg,req.body.txtcontact,req.body.txtaddress,req.body.txtcity,req.body.txtprooffile,req.body.txtproof,req.body.txtsports,req.body.txtprev,req.body.txtwebsite,req.body.txtinsta],function(err){
        if(err==null)
            resp.send("RECORD SENT SUCCESSFULLY....");
        else
        {resp.send(err.message);
            console.log(err.message)
        }
       })
    
})
app.get("/searchuser",function(req,resp){
    alert("Saved")
    // let email=req.query.txtemail
    // mysqlServer.query("select * from organisation where emailid=?",[email],function(err,jsonArray)
    // {
    //     if(err!=null)
    //     {
    //         resp.send(err.message)
    //     }
    //     else{
    //         resp.send("User Exsists");
    //     }
    // })
})
app.get("/lol",function(req,resp){
    resp.sendFile(__dirname+"/public/organiser.html")
})
app.use(express.urlencoded(true))



app.post("/savee",function(req,resp){
    resp.send(req.body)
})


app.get("/fetch-all-users",function(req,resp)
{
    
    mysqlServer.query("select * from user",function(err,jsonArray)
    {
        
        if(err!=null)
        {
            resp.send(err.message);
        }
        else
       
                resp.send(jsonArray);
           
    })

})
app.get("/angular",function(req,resp){
    resp.sendFile(__dirname+"/public/angular.html")
})

app.get("/fetchall",function(req,resp){
    mysqlServer.query("select * from user",function(err,jsonArray)
    {
        
        if(err!=null)
        {
            resp.send(err.message);
        }
        else
       
                resp.send(jsonArray);
           
    })
})
app.get("/publish",function(req,resp){
    resp.sendFile(__dirname+"/public/publish.html")
})
app.post("/published-tour", async function(req,resp)
    
{
    let filename=""
    
    
    
        filename=req.files.image.name
        let path=__dirname+"/public/images/"+filename
        req.files.image.mv(path);
        await cloudinary.uploader.upload(path).then(function(result){
            filename=result.url
            console.log(filename)
        })
    
    console.log(filename)
    
    


    req.body.picpath=filename

    let email=req.body.txmail;
    let event=req.body.txevent;
    let game=req.body.txgame;
    let city=req.body.txcity;
    let date=req.body.txdate;
    let fee=req.body.txfee;
    let extra=req.body.txextra;
    console.log(extra)
    console.log(event)
    mysqlServer.query("insert into published values(?,?,?,?,?,?,?,?)",[email,event,game,city,date,req.body.picpath,fee,extra],function(err){
        if (err==null)
        {
            resp.send("Saved Sucessfully")
        }
        else{
            console.log(err.message)
        }
    })
    
})

app.get("/fetch-tour-all",function(req,resp){
    mysqlServer.query("select * from published",function(err,jsonArray)
    {
        if(err!=null)
        {
            resp.send(err.message)
        }
        else{
            resp.send(jsonArray);
        }
    })
})

app.get("/pubpage",function(req,resp){
    resp.sendFile(__dirname+"/public/torunamentpage.html")
})

app.get("/fetchcities",function(req,resp){
    mysqlServer.query("select city from published",function(err,jsonArray){
        if(err!=null)
        {
            resp.send(err.message)
        }
        else
        {
            resp.send(jsonArray)
        }
    })
})

app.get("/fetchsport",function(req,resp){
    mysqlServer.query("select gamename from published",function(err,jsonArray){
        if(err!=null)
        {
            resp.send(err.message)
        }
        else
        {
            resp.send(jsonArray)
        }
    })
})

app.get("/findtournament",function(req,resp){
    let city=req.query.city
    let sport=req.query.game

    mysqlServer.query("select * from published where city=?",[city],function(err,jsonArray){
        if (err!=null)
        {
            resp.send(err.message)
        }
        else
        {
            console.log(jsonArray)
            resp.send(jsonArray)
        }
    })
})

app.get("/update-pass",function(req,resp){
    let email=req.query.txtEmail
    let oldpass=req.query.txtPass
    let newpass=req.query.txtNewPass
    console.log(email)
    console.log(oldpass)
    console.log(newpass)

    mysqlServer.query("update user set pwd=? where emailid=? and pwd=?",[newpass,email,oldpass],function(err,result){
        console.log(result.affectedRows)

        if (err!=null)
        {
            resp.send(err.message)
        }
        else if (result.affectedRows == 1) {
            resp.send("Password updated successfully");
        } else {
            resp.send("No matching record found or password is the same.");
        }
    })
})

app.post("/saveplayer",async function(req,resp){
    let filename=""
    
    
    
        filename=req.files.profilePic.name
        let path=__dirname+"/public/images/"+filename
        req.files.profilePic.mv(path);
        await cloudinary.uploader.upload(path).then(function(result){
            filename=result.url
            console.log(filename)
        })
    
    console.log(filename)
    req.body.picpath=filename
    mysqlServer.query("insert into players values(?,?,?,?,?,?,?,?,?)",[req.body.txtEmail,req.body.txtName,req.body.DOB,req.body.txtGames,req.body.txtMobile,req.body.txtGender,req.body.txtCity,req.body.txtExtra,req.body.picpath],function(err){
        if (err==null)
        {
            resp.send("Saved Successfully")
        }
        else
        {
            resp.send(err.message)
            console.log(err.message)
        }
    })
})



app.post("/updateplayer",async function(req,resp){
    let filename=""
    
    
    
        filename=req.files.profilePic.name
        let path=__dirname+"/public/images/"+filename
        req.files.profilePic.mv(path);
        await cloudinary.uploader.upload(path).then(function(result){
            filename=result.url
            console.log(filename)
        })
    
    console.log(filename)
    req.body.picpath=filename
    mysqlServer.query("update players set emailid=? , playername=? , dob=? , games=? , mobileno=? , gender=? , city=? , bio =? , picpath=? where emailid=?",[req.body.txtEmail,req.body.txtName,req.body.DOB,req.body.txtGames,req.body.txtMobile,req.body.txtGender,req.body.txtCity,req.body.txtExtra,req.body.picpath,req.body.txtEmail],function(err){
        if (err==null)
        {
            resp.send("Updated Successfully")
        }
        else
        {
            resp.send(err.message)
            console.log(err.message)
        }
    })
})

