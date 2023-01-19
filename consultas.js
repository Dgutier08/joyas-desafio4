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
const getJoyas = async ({ limits = 5, order_by = "id_ASC", page = 1 }) => {
    const [campo, direccion] = order_by.split("_")
    const offset = (page - 1) * limits;
    const formattedQuery = format(
        "SELECT * FROM joyas order by %s %s limit %s OFFSET %S",
        campo,
        direccion,
        limits,
        offset
    )
    console.log("format", formattedQuery);
    const { rows: Joyas } = await pool(formattedQuery)
    return Joyas;
    }

    //con filtros
    const getJoyasFiltro = async ({ precio_max, stock_min }) => {
        let filtros = [];
        const values = [];
        const agregarFiltro = (campo, comparador, valor) => {
            values.push(valor);
            const { length } = filtros;

            filtros.push(`${campo} ${comparador} $${length + 1}`);
        };
        if (precio_max) agregarFiltro("precio", "<=", precio_max);
        if (stock_min) agregarFiltro("stock", ">=", stock_min);
        if (categoria) agregaFiltro ("categoria", "=", categoria)
        if (metal) agregaFiltro ("metal", "=", metal)


        let consulta = "SELECT * FROM inventario";

        if (filtros.length > 0) {
            filtros = filtros.join(" AND ");
            consulta += ` WHERE ${filtros}`;
        }
        const { rows: Joyas } = await pool.query(consulta, values);
        return Joyas;
    };

    const datosHATEOAS = (joyas) => {
        const results = joyas
          .map((p) => {
            return {
              name: n.nombre,
              href: `/joyas/joyas/${n.id}`,
            };
          })
          .slice(0, 4);
        const total = productos.length;
        const HATEOAS = {
          TotalJoyas,
          TotalStock,
          Results
        };
        return HATEOAS;
      };

module.exports = { getJoyas, getJoyasFiltro, datosHATEOAS }