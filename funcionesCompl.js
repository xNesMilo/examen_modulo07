function getForm  (req) {
    return new Promise((res, rej) => {
      let str = ''
      req.on('data', function (chunk) {
        str += chunk
      })
      req.on('end', function () {
        const obj = JSON.parse(str)
        res(obj)
      })
    })
}

const formatDate = (current_datetime)=>{
    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
    return formatted_date;
}

module.exports={getForm,formatDate}