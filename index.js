const express = require("express");
const { reportRequest} = require("./logger") 
const app = express();

const {getJoyas, getJoyasFiltro, datosHATEOAS } = require("./consultas");


app.get('/joyas', reportRequest, async (req, res) => {
    try {
      const queryStrings = req.query;
      const inv = await getJoyas(queryStrings);
      const HATEOAS = await datosHATEOAS(inv);
      res.json(HATEOAS);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  })
  
  app.get("/joyas/filtros", reportRequest, async (req, res) => {
    try{
    const queryStrings = req.query;
    const catalogo = await getJoyasFiltro(queryStrings);
    res.status(200).json(catalogo);
    
    } catch (error){
        console.error(error);
        res.status(500).send(error.message);
    }
});
  
   app.get("*", (req, res) => {
     res.status(404).json({ message: "Esta ruta no existe" });
   });
  
  app.listen(3000, console.log("Escuchando por el puerto 3000"));
