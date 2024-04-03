import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let allArticles = [];

const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

app.get("/", (req, res) => {
    allArticles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.render("index.ejs", {
        allArticles: allArticles.map(article => {
            return {
                ...article,
                createdAt: formatDate(article.createdAt)
            };
        })
    });
});

app.get("/new", (req, res) => {
    res.render("./partials/new.ejs");
});

app.get("/read-more/:title", (req, res) => {
    const { title } = req.params;
    const decodedTitle = decodeURIComponent(title);
    const article = allArticles.find(article => article.title === decodedTitle);

    if (!article) {
        return res.status(404).send("Article not found");
    }

    res.render("./partials/read-more.ejs", {
        article,
        formattedDate: formatDate(article.createdAt)
    });
});

app.get("/edit/:title", (req, res) => {
    const { title } = req.params;
    const decodedTitle = decodeURIComponent(title);
    const article = allArticles.find(article => article.title === decodedTitle);

    if (!article) {
        return res.status(404).send("Article not found");
    }

    res.render("./partials/edit.ejs", {
        article
    });
});

app.post("/update/:title", (req, res) => {
    const { title } = req.params;
    const decodedTitle = decodeURIComponent(title);
    const articleIndex = allArticles.findIndex(article => article.title === decodedTitle);

    if (articleIndex === -1) {
        return res.status(404).send("Article not found");
    }

    allArticles[articleIndex].title = req.body["edit-post-title"];
    allArticles[articleIndex].description = req.body["edit-post-description"];
    allArticles[articleIndex].body = req.body["edit-post-body"];

    res.redirect("/")
});

app.post("/delete/:title", (req,res) => {
    const { title } = req.params;
    const decodedTitle = decodeURIComponent(title);;
    const articleIndex = allArticles.findIndex(article => article.title === decodedTitle);

    if (articleIndex === -1) {
        return res.status(404).send("Article not found");
    }

    allArticles.splice(articleIndex, 1);

    res.redirect("/");
});


app.post("/", (req, res) => {
    const currentDate = new Date();

    let newArticle = {
        title: req.body["new-post-title"],
        createdAt: currentDate,
        description: req.body["new-post-description"],
        body: req.body["new-post-body"],
        }

    allArticles.push(newArticle);
    
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});