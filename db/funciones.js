const pool = require('./conexion')
const val = require('./validaciones')

// Mostrar Usuarios
const mostrarUsuarios = async () => {
  const client = await pool.connect()
  const resp = await client.query({
    text: "select * from usuarios"
  })
  client.release()
  return resp.rows
}
//insertar usuarios
const crearUsuario = async (_nombre, _balance) => {
  const dtsUsuario = {
    nombre: _nombre,
    balance: _balance
  }

  await val.validacion(dtsUsuario, 1)
  // if (mensaje != undefined) {
  //   console.log(mensaje);
  //   return
  // }
  //________________________________________________________________
  let nom = _nombre.toLowerCase()
  const client = await pool.connect()
  const validarNombre = await client.query({
    text: 'select nombre from usuarios where nombre=$1',
    values: [nom]
  })

  if (validarNombre.rows[0] != undefined) {
    console.log('usuario ya existe');
    return
  }

  const resp = await client.query({
    text: "insert into usuarios (nombre, balance ) values ($1,$2)",
    values: [nom, _balance]
  })
  client.release()
}
// Modificar usuarios
  const editarUsuarios = async (nombre, balance, id) => {
  const dtsUsr = {
    nombre,
    balance
  }

  const mensaje = await val.validarEditar(dtsUsr)
  if (mensaje != undefined) {
    throw mensaje;
    return
  }

  const client = await pool.connect()
  const resp = await client.query({
    text: "update usuarios set nombre=$1,balance=$2 where id=$3",
    values: [nombre, balance, id]
  })
  client.release()
}
//Eliminar usuarios
const eliminarUsuario = async (id) => {
  const client = await pool.connect()
  const respTrans = await client.query({
    text: "delete from transferencias  where emisor=$1 or receptor=$1",
    values: [id]
  })
  const respUsu = await client.query({
    text: "delete from usuarios where id=$1",
    values: [id]
  })
  client.release()
}
const crearTransferencias = async (emi, _receptor, _monto, _fecha) => {
  const client = await pool.connect()
  //Obtener datos del emisor
  const datosEmisor = await client.query({
    text: "select * from usuarios where nombre=$1",
    values: [emi]
  })
  const emisor = datosEmisor.rows[0]
  const id_emisor = emisor.id
  const bal_emisor = emisor.balance
  const datosReceptor = await client.query({
    text: "select * from usuarios where nombre=$1",
    values: [_receptor]
  })
  const receptor = datosReceptor.rows[0]
  const id_receptor = receptor.id
  const bal_receptor = receptor.balance
  const transferencia = {
    monto: _monto,
    balance: bal_emisor
  }
  await val.validarTrsUsr(id_emisor,id_receptor)
  await val.validacion(transferencia, 2)
  const resta = parseFloat(bal_emisor) - _monto
  const suma = parseFloat(bal_receptor) + parseFloat(_monto)

  const montoActualizarE = await client.query({
    text: 'update usuarios set balance=$1 where id=$2',
    values: [resta.toFixed(2), id_emisor]

  })
  const montoActualizarR = await client.query({
    text: 'update usuarios set balance=$1 where id=$2',
    values: [suma.toFixed(2), id_receptor]
  })

  const resp = await client.query({
    text: "insert into transferencias (emisor, receptor, monto,fecha) values ($1,$2,$3,$4)",
    values: [id_emisor, id_receptor, _monto, _fecha]
  })
  client.release()
}

const historialtransferencias = async () => {
  const client = await pool.connect()
  let res
  try {
    res = await client.query({
      text: "SELECT transferencias.id, emisores.nombre as Emisor, receptores.nombre as Receptor, Monto,fecha FROM transferencias JOIN usuarios as emisores ON emisor=emisores.id join usuarios as receptores on receptor= receptores.id",
      rowMode: 'array'
    })
  } catch (error) {
    console.log('error:', error);
  }
  return res.rows
}

module.exports = { historialtransferencias, crearTransferencias, crearUsuario, mostrarUsuarios, editarUsuarios, eliminarUsuario }