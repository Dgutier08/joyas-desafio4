const express = require("express");
const app = express();

const {getJoyas, getJoyasFiltro, datosHATEOAS } = require("./consultas");


app.get("/joyas", async (req, res) => {
    try{
        const queryStrings = req.query;
        const joyas = await getJoyas(queryStrings);
        const HATEOAS= await datosHATEOAS(joyas);
        res.status(200).json(HATEOAS);
    } catch (error){
        console.error(error);
    }
  
  });
  
  app.get("/joyas/filtros", async (req, res) => {
    const queryStrings = req.query;
    const joyas = await getJoyasFiltro(queryStrings);
    res.status(200).json(joyas);
    try{
    } catch (error){
        console.error(error);
    }
});
  
  app.get("*", (req, res) => {
    res.status(404).json({ message: "Esta ruta no existe" });
  });
  
  app.listen(3000, console.log("Escuchando por el puerto 3000"));
