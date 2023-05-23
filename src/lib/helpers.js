const bcrypt = require("bcryptjs");
const helpers = {};
var moment = require('moment');

helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (e) {
    console.log(e);
  }
};

helpers.verifyPass = (contrasena) => {
  if (contrasena.length < 8) {
    return false;
  } else if (/\s/.test(contrasena)) {
    return false;
  } else if (!/\d/.test(contrasena) || !/[a-zA-Z]/.test(contrasena)) {
    return false;
  } else {
    return true;
  }
};

helpers.porcentajeCompletado = (total, completado) => {
  return (completado * 100) / total;
};

helpers.cambioArray = (respuestas) => {
  // Suponiendo que tienes el arreglo de objetos en la variable 'encuestas'

  // Recorre el arreglo de objetos
  respuestas.forEach(function (respuestas) {
    // Recorre todas las propiedades que comienzan con "pregunta"
    Object.keys(respuestas).forEach(function (key) {
      if (key.startsWith("pregunta")) {
        // Convierte el valor de la propiedad a mayúsculas
        respuestas[key] = respuestas[key].toUpperCase();
      }
    });
  });
  // Suponiendo que tienes el arreglo de objetos en la variable 'encuestas'
  // Recorre el arreglo de objetos
  respuestas.forEach(function (encuesta) {
    // Recorre todas las propiedades que comienzan con "pregunta"
    Object.keys(encuesta).forEach(function (key) {
      if (key.startsWith("pregunta")) {
        if (
          parseInt(key.substring(8)) >= 33 &&
          parseInt(key.substring(8)) <= 48
        ) {
          // Si la pregunta está entre la 33 y la 48, entonces realiza el cambio de valores
          switch (encuesta[key]) {
            case "SIEMPRE":
              encuesta[key] = 0;
              break;
            case "CASI_SIEMPRE":
              encuesta[key] = 1;
              break;
            case "ALGUNAS_VECES":
              encuesta[key] = 2;
              break;
            case "CASI_NUNCA":
              encuesta[key] = 3;
              break;
            case "NUNCA":
              encuesta[key] = 4;
              break;
            default:
              encuesta[key] = 0;
              break;
          }
        } else {
          // Si no está entre la 33 y la 48, entonces realiza el cambio de valores
          switch (encuesta[key]) {
            case "SIEMPRE":
              encuesta[key] = 4;
              break;
            case "CASI_SIEMPRE":
              encuesta[key] = 3;
              break;
            case "ALGUNAS_VECES":
              encuesta[key] = 2;
              break;
            case "CASI_NUNCA":
              encuesta[key] = 1;
              break;
            case "NUNCA":
              encuesta[key] = 0;
              break;
            default:
              encuesta[key] = 0;
              break;
          }
        }
      }
    });
  });

  return respuestas;
};

helpers.total = (encuestas) => {
  let sumas = [];

encuestas.forEach(function(encuesta) {
  let suma = 0;
  // Recorre todas las propiedades del objeto
  for (const [key, value] of Object.entries(encuesta)) {
    // Si la propiedad comienza con "pregunta", suma su valor
    if (key.startsWith('pregunta')) {
      suma += value;
    }
  }
  // Agrega la suma al arreglo de sumas
  sumas.push(suma);
  });
  
  return sumas;
};

helpers.general = (arr) => {

  
    var conteo = {
      "Muyalto": 0,
      "Alto": 0,
      "Medio": 0,
      "Bajo": 0,
      "Nuloodespreciable": 0
    };
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] >= 90) {
        conteo["Muyalto"]++;
      } else if (arr[i] >= 70 && arr[i] < 90) {
        conteo["Alto"]++;
      } else if (arr[i] >= 45 && arr[i] < 70) {
        conteo["Medio"]++;
      } else if (arr[i] >= 20 && arr[i] < 45) {
        conteo["Bajo"]++;
      } else if (arr[i] >= 0 && arr[i] < 20) {
        conteo["Nuloodespreciable"]++;
      }
    }
    return conteo;
  
};

helpers.totalCAT1 = (encuestas) => {
  let sumas = [];

  encuestas.forEach(function(encuesta) {
    let suma = 0;
    // Recorre todas las propiedades del objeto
    for (const [key, value] of Object.entries(encuesta)) {
      // Si la propiedad es "pregunta16", "pregunta17" o "pregunta18", suma su valor
      if (key === 'pregunta16' || key === 'pregunta17' || key === 'pregunta18') {
        suma += value;
      }
    }
    // Agrega la suma al arreglo de sumas
    sumas.push(suma);
  });
  
  return sumas;
};


helpers.CAT1 = (arr) => {

  
  var conteo = {
    "Muyalto": 0,
    "Alto": 0,
    "Medio": 0,
    "Bajo": 0,
    "Nuloodespreciable": 0
  };
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] >= 9) {
      conteo["Muyalto"]++;
    } else if (arr[i] >= 7 && arr[i] < 9) {
      conteo["Alto"]++;
    } else if (arr[i] >= 5 && arr[i] < 7) {
      conteo["Medio"]++;
    } else if (arr[i] >= 3 && arr[i] < 5) {
      conteo["Bajo"]++;
    } else if (arr[i] >= 0 && arr[i] < 3) {
      conteo["Nuloodespreciable"]++;
    }
  }
  return conteo;

};

helpers.totalCAT2 = (encuestas) => {
  let sumas = [];

  encuestas.forEach(function(encuesta) {
    let suma = 0;
    // Recorre todas las propiedades del objeto
    for (const [key, value] of Object.entries(encuesta)) {
      // Si la propiedad es "pregunta16", "pregunta17" o "pregunta18", suma su valor
      if (key === 'pregunta19' || key === 'pregunta20' || key === 'pregunta21' || key === 'pregunta24' || key === 'pregunta22' || key === 'pregunta23' || key === '57' || key === 'pregunta58' || key === 'pregunta59') {
        suma += value;
      }
    }
    // Agrega la suma al arreglo de sumas
    sumas.push(suma);
  });
  
  return sumas;
};

helpers.CAT2 = (arr) => {

  
  var conteo = {
    "Muyalto": 0,
    "Alto": 0,
    "Medio": 0,
    "Bajo": 0,
    "Nuloodespreciable": 0
  };
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] >= 40) {
      conteo["Muyalto"]++;
    } else if (arr[i] >= 30 && arr[i] < 40) {
      conteo["Alto"]++;
    } else if (arr[i] >= 20 && arr[i] < 30) {
      conteo["Medio"]++;
    } else if (arr[i] >= 10 && arr[i] < 20) {
      conteo["Bajo"]++;
    } else if (arr[i] >= 0 && arr[i] < 10) {
      conteo["Nuloodespreciable"]++;
    }
  }
  return conteo;

};

helpers.totalCAT3 = (encuestas) => {
  let sumas = [];

  encuestas.forEach(function(encuesta) {
    let suma = 0;
    // Recorre todas las propiedades del objeto
    for (const [key, value] of Object.entries(encuesta)) {
      // Si la propiedad es "pregunta16", "pregunta17" o "pregunta18", suma su valor
      if (key === 'pregunta29' || key === 'pregunta30' || key === 'pregunta31' || key === 'pregunta32' ) {
        suma += value;
      }
    }
    // Agrega la suma al arreglo de sumas
    sumas.push(suma);
  });
  
  return sumas;
};

helpers.CAT3 = (arr) => {

  
  var conteo = {
    "Muyalto": 0,
    "Alto": 0,
    "Medio": 0,
    "Bajo": 0,
    "Nuloodespreciable": 0
  };
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] >= 12) {
      conteo["Muyalto"]++;
    } else if (arr[i] >= 9 && arr[i] < 12) {
      conteo["Alto"]++;
    } else if (arr[i] >= 6 && arr[i] < 9) {
      conteo["Medio"]++;
    } else if (arr[i] >= 4 && arr[i] < 6) {
      conteo["Bajo"]++;
    } else if (arr[i] >= 0 && arr[i] < 4) {
      conteo["Nuloodespreciable"]++;
    }
  }
  return conteo;

};

helpers.totalCAT4 = (encuestas) => {
  let sumas = [];

  encuestas.forEach(function(encuesta) {
    let suma = 0;
    // Recorre todas las propiedades del objeto
    for (const [key, value] of Object.entries(encuesta)) {
      // Si la propiedad es "pregunta16", "pregunta17" o "pregunta18", suma su valor
      if (key === 'pregunta23' || key === 'pregunta24' || key === 'pregunta25' || key === 'pregunta28' || key === 'pregunta29' || key === 'pregunta30' || key === 'pregunta31' || key === 'pregunta32' || key === 'pregunta44' || key === 'pregunta45' || key === 'pregunta46' || key === 'pregunta33' || key === 'pregunta34' || key === 'pregunta35' || key === 'pregunta36' || key === 'pregunta37' || key === 'pregunta38' || key === 'pregunta39' || key === 'pregunta40') {
        suma += value;
    }
    
    }
    // Agrega la suma al arreglo de sumas
    sumas.push(suma);
  });
  
  return sumas;
};

helpers.CAT4 = (arr) => {
  var conteo = {
    "Muyalto": 0,
    "Alto": 0,
    "Medio": 0,
    "Bajo": 0,
    "Nuloodespreciable": 0
  };
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] >= 38) {
      conteo["Muyalto"]++;
    } else if (arr[i] >= 28 && arr[i] < 38) {
      conteo["Alto"]++;
    } else if (arr[i] >= 18 && arr[i] < 28) {
      conteo["Medio"]++;
    } else if (arr[i] >= 10 && arr[i] < 18) {
      conteo["Bajo"]++;
    } else if (arr[i] >= 0 && arr[i] < 10) {
      conteo["Nuloodespreciable"]++;
    }
  }
  return conteo;

};


helpers.promedioGeneral = (arr) => {
  const sum = arr.reduce((acc, curr) => acc + curr, 0);
  return sum / arr.length;
};

helpers.accionGen = (valor) => {
  if (valor > 0 && valor < 20) {
    return "El riesgo resulta despreciable por lo que no se requiere medidas adicionales";
  } else if (valor >= 20 && valor < 45) {
    return "Bajo Es necesario una mayor difusión de la política de prevención de riesgos psicosociales y programas para: la prevención de los factores de riesgo psicosocial, la promoción de un entorno organizacional favorable y la prevención de la violencia laboral.";
  } else if (valor >= 45 && valor < 70) {
    return "Medio Se requiere revisar la política de prevención de riesgos psicosociales y  programas para la prevención de los factores de riesgo psicosocial, la promoción de un entorno organizacional favorable y la prevención de la violencia laboral, así como reforzar su aplicación y difusión, mediante un Programa de intervención";
  } else if (valor >= 70 && valor < 90) {
    return "Alto Evaluaciones específicas para cada categoría y dominio de la NOM-035. Campañas de sensibilización. Revisión de la política de prevención de riesgos psicosociales. Programas para la prevención de factores de riesgo psicosocial. Promoción de un entorno organizacional favorable. Prevención de la violencia laboral.";
  } else if (valor >= 90) {
    return "Muy Alto Evaluaciones específicas para cada categoría y dominio de la NOM-035. Campañas de sensibilización. Revisión de la política de prevención de riesgos psicosociales. Programas para la prevención de factores de riesgo psicosocial. Promoción de un entorno organizacional favorable. Prevención de la violencia laboral.";
  } else {
    return "Valor fuera de rango";
  }
};

helpers.estadoGen= (valor) => {
  if (valor > 0 && valor < 20) {
    return "Nulo o despreciable";
  } else if (valor >= 20 && valor < 45) {
    return "Bajo";
  } else if (valor >= 45 && valor < 70) {
    return "Medio";
  } else if (valor >= 70 && valor < 90) {
    return "Alto";
  } else if (valor >= 90) {
    return "Muy alto";
  } else {
    return "Valor fuera de rango";
  }
};

helpers.colorGen= (valor) => {
  if (valor > 0 && valor < 20) {
    return "#87CEEB";
  } else if (valor >= 20 && valor < 45) {
    return "#00FF00";
  } else if (valor >= 45 && valor < 70) {
    return "#FFFF00";
  } else if (valor >= 70 && valor < 90) {
    return "#FFA500";
  } else if (valor >= 90) {
    return "#FF0000";
  } else {
    return "Valor fuera de rango";
  }
};

helpers.genLinks = (arr, idHotel, idEncuesta,nombreHotel) => {
  arr.forEach(obj => {
    obj.telefono = `+521${obj.telefono}`;
    obj.link = `http://64.227.18.250/${idHotel}/${idEncuesta}/encuesta/${obj.idEmpleado}`;
    obj.nombreHotel = nombreHotel;
  });
  return arr;
}
//Diferencia de fechas
helpers.getDiferenciaFecha = (fechaInicio, fechaFin) => {
  var diff = moment(fechaFin).valueOf() - moment(fechaInicio).valueOf();
  var diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  return diffInDays;
};

module.exports = helpers;
