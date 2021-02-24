'use strict';
require('dotenv').config();
const AWS = require('aws-sdk');
const csv = require('csvtojson');
/**
 * Registrar nuevos eventos como compras de los usuarios o interacciones sobre productos
 * @param {Array[i].USER_ID, Array[i].ITEM_ID, Array[i].TIMESTAMP} event 
 */
module.exports.handler = async event => {
  try {
    const newRegisters = event

    // cargar datos
    const csvToJSON = await getJSONfromCSV(newRegisters);

    // actualizar csv
    const response = await updateS3CSV(csvToJSON) 

    return {
      statusCode: 200,
      body: JSON.stringify(
        response,
        null,
        2
      ),
    };
  } catch (e) {
    console.error(e)
  }
};

/**
 * Obtener s3 y agregar nuevos registros
 * @param {*} newRegisters 
 */
async function getJSONfromCSV(newRegisters) {
  const s3 = new AWS.S3();
  const params = {
    Bucket: 'intl-latam-ec-tfm',
    Key: 'liphycos-items-users.csv'
  };

  // obtener csv (stream)
  const stream = s3.getObject(params).createReadStream();

  // convertir de csv (stream) a JSON
  const json = await csv().fromStream(stream);
  json.push(newRegisters)
  return json;
};

/**
 * Actualizar s3
 * @param {*} data 
 */
async function updateS3CSV(data) {
  const s3 = new AWS.S3();
  const params = {
    Bucket: 'intl-latam-ec-tfm',
    Key: 'liphycos-items-users.csv',
    Body: JSON.stringify(data, null, 2)
  };

  s3.upload(params, (s3Err, data) => {
    if (s3Err) throw s3Err
    console.log(`File uploaded successfully at ${data.Location}`)
    return true;
  })
};

