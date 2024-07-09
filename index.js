import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static("public"));


function inArray(needle,haystack)
{
    var count=haystack.length;
    for(var i=0;i<count;i++)
    {
        if(haystack[i]===needle){return true;}
    }
    return false;
}

// Handles blog submissions

app.post("/submit",(req,res)=>{
    let key = req.body["title"];
    let value = req.body["blog"];
    let NoBlog =  false
    let existingBlog = false
    let blogList = Object.keys(req.cookies);

    // checks for existing blogs
    if(inArray(key,blogList) === true){
        existingBlog = true
    // sets a secure cookie for new blogs
    }else if(key){
        res.cookie(key, value, { httpOnly: true, secure: true }); 
    }else{
        NoBlog = true
    }
    
    res.render("index.ejs",{
        message: NoBlog,
        next: existingBlog
    })
});

// Fetches blog content based on query parameter and renders it on the content page.
app.get("/-content",(req,res)=>{
    let key = req.query.blogKey;
    let value = req.cookies[key]; 
    res.render("content.ejs", {
        title: key,
        content: value
    });
    
    
});

// Serves the home page.
app.get("/",(req,res)=>{
    res.render("index.ejs")
});

// Retrieves blog titles from cookies and renders the blogs page with the list.
app.get("/blogs",(req,res)=>{
    let blogList = Object.keys(req.cookies);
    res.render("blogs.ejs",{
    listOfBlogs: blogList,
   })
});


// Starts the server listening on the specified port.
app.listen(port,()=>{

});

//Handles request to delete a blog
app.post("/delete",(req,res)=>{
    let deleteCookie = req.body["blogTitle"];
    
    res.clearCookie(deleteCookie);
    res.redirect("/blogs");
});

//Handles request to edit blog
app.post("/edit",(req,res)=>{
    let key = req.body["blogTitle"]
    let value = req.cookies[key];
    res.render("update.ejs",{
        title: key,
        content: value
    });
});

// Handles POST requests to "/update" or Save edit
app.post("/update",(req,res)=>{
    let key = req.body["title"];
    let value = req.body["blog"];
    res.cookie(key, value, { httpOnly: true, secure: true});
    res.render("content.ejs",{
        title: key,
        content: value
    })
});