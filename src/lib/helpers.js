const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

helpers.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (e) {
        console.log(e);
    } 
}; 

helpers.verifyPass= (contrasena) =>{
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


module.exports = helpers;