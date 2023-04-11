//Commerce
import ProdServ from '../models/ProdServ';
import boom from '@hapi/boom';
//Que es una desestructuracion en javascript
//FIC: GET PRODUCTS AND SERVICES LIST
export const getProdServList = async () => {
    let prodServList;
    try {
          prodServList = await ProdServ.find();
          return(prodServList);
    } catch (error) {
      //res.status(500).json({ message: 'Error: ' + ficError });
      throw boom.internal(error);
    }
  };

  //FIC: GET PRODUCT OR SERVICE BY ID
export const getProdServItem = async (id, keyType) => {
    let prodServItem;
   
    try {
      if (keyType === 'OK') {
        prodServItem = await ProdServ.findOne({
        IdProdServOK: id,
        });
      } else if (keyType === 'BK') {
          prodServItem = await ProdServ.findOne({
          IdProdServBK: id,
        });
      }
      return(prodServItem);
    } catch (error) {
      throw boom.internal(error);
    }
  };