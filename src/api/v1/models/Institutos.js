import * as mongoose from 'mongoose';
import config from '../../../config/config';

//Education

const institutosSchema  = new mongoose.Schema({
    IdInstitutoOK : { type : String, required : true },
    IdInstitutoBK : { type : String, required : true },
    DesInstituto  : { type : String, required : true },
    Alias        : { type : String, required : false },
    Matriz        : { type : String, required : false },
    Giro          : { type : String, required : false },
    IdInstitutoSupOK  : { type : String, required : false }
});

//Education

export default mongoose.model(
    'cat_institutos',
    institutosSchema,
    'cat_institutos'
)