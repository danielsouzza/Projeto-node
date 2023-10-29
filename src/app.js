const express = require("express");
const cors = require("cors");

 const { v4: uuid, validate: isUuid } = require('uuid');
const {repository} = require("yarn/lib/cli");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json( repositories );
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes:0
  }
  repositories.push(repository);
  return response.json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;
  const repo = repositories.find((it)=>it.id == id);
  if(repo == undefined){
    return response.status(400).send("Repositório inexistente")
  }
  repo.title = title;
  repo.url = url;
  repo.techs = techs;
  return response.json(repo)
  
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const item = repositories.findIndex((it)=>it.id == id);
  if(item >= 0){
    repositories.splice(item,1);
  }else{
    return response.status(400).send("Repositório inexistente")
  }

  return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repo = repositories.find((it)=>it.id == id);
  if(repo == undefined){
    return response.status(400).send("Repositório inexistente")
  }
  repo.likes+=1;
  return response.json(repo)
});

module.exports = app;
