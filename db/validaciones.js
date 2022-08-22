const validacion = async (obj, accion) => {
  const balance = parseInt(obj.balance)
  console.log(balance);

  //Validando usuario
  if (accion == 1) {
    const nombre = (obj.nombre).trim()
    if (!nombre) {
      throw 'Ingrese su nombre por favor'

    } else if (balance <= 0) {
      throw 'Balance inferior o igual a 0'

    } else if (!balance) {
      throw 'Balance no corresponde a número ';
    }
  
  //Validacion de transferencias  
  } else { 
    const monto = parseInt(obj.monto)
    console.log(monto);
    if (isNaN(monto)) {
      throw 'Debe ingresar un valor numerico en el campo monto'
    }else if (monto <= 0) {
      throw 'Alerta alerta intento de robo'
    }else if (balance < monto) {
      throw 'Saldo insuficiente para realizar la transferencia'
    }else if (balance <= 0) {
      throw 'Monto debe ser mayor a 0'
    }
  }
}

const validarEditar = async (obj) => {
  let mensaje
  const balance = parseInt(obj.balance)
  const nombre = (obj.nombre).trim()

  if (!nombre) {
    mensaje = 'Ingrese su nombre por favor'

  } else if (balance <= 0) {
    mensaje = 'Balance inferior o igual a 0'

  } else if (!balance) {
    mensaje = 'Balance no corresponde a número ';
  }
  return mensaje
}

const validarTrsUsr =async(id_emisor,id_receptor)=>{
  if(id_emisor == id_receptor){
    throw 'no no no,no te puedes depositar a ti mismo pillin!!'
  }
}
module.exports = { validarTrsUsr, validarEditar, validacion }