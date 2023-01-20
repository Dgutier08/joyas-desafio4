const { Pool } = require('pg');
const format = require('pg-format');
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'da',
    database: 'joyas',
    port: 5432,
    allowExitOnIdle: true
});

//aplicando Offset
const getJoyas = async ({ limits = 10, order_by = "id_ASC", page = 1 }) => {
    const [campo, direccion] = order_by.split("_")
    const offset = (page - 1) * limits;
    const formattedQuery = format('SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s', campo, direccion, limits, offset);
    const { rows: articulo, rowCount } = await pool.query(formattedQuery)
    
    if (rowCount === 0) {
        throw { code: 404, message: `No se encontraron resultados` };
      };
    
    return articulo;
    }

    //con filtros
    const getJoyasFiltro = async ({ precio_max, precio_min, categoria, metal }) => {
        let filtros = []
        const values = []
        const agregarFiltro = (campo, comparador, valor) => {
            values.push(valor)
            const { length } = filtros
            filtros.push(`${campo} ${comparador} $${length + 1}`)
        }
        if (precio_max) agregarFiltro('precio', '<=', precio_max)
        if (precio_min) agregarFiltro('precio', '>=', precio_min)
        if (categoria) agregarFiltro('categoria', '=', categoria)
        if (metal) agregarFiltro('metal', '=', metal)
    
    
        let consulta = "SELECT * FROM inventario"
        if (filtros.length > 0) {
            filtros = filtros.join(" AND ")
            consulta += ` WHERE ${filtros}`
        }
        const { rows: inventario } = await pool.query(consulta, values)
        return inventario
    }
    

    const datosHATEOAS = (joyas) => {
        const results = joyas.map((x) => {
          return {
            name: x.nombre,
            href: `joyas/joya/${x.id}`,
          }
        });
        const totalJoyas = joyas.length
        const totalStock =  joyas.reduce((total, x) => total + x.stock, 0);
        const HATEOAS = {
          totalJoyas,
          totalStock,
          results
        }
      
        return HATEOAS;
      };

module.exports = { getJoyas, getJoyasFiltro, datosHATEOAS }