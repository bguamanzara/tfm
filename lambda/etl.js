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
    // actualizar datos
    const response = await updateS3(newRegisters);
    return {
      statusCode: 200,
      body: JSON.stringify(response,null,2)
    };
  } catch (e) {
    console.error(e)
  }
};

/**
 * Obtener s3 y agregar nuevos registros
 * @param {*} newRegisters 
 */
async function updateS3(newRegisters) {
  const s3 = new AWS.S3();
  let params = {
    Bucket: 'intl-latam-ec-tfm',
    Key: 'liphycos-items-users.csv'
  };
  // obtener csv (stream)
  const stream = s3.getObject(params).createReadStream();
  // convertir de csv (stream) a JSON
  const json = await csv().fromStream(stream);
  json.push(newRegisters)
  params.Body = JSON.stringify(data, null, 2)
  // actualizar s3
  s3.upload(params, (s3Err, data) => {
    if (s3Err) throw s3Err
    console.log(`File uploaded successfully at ${data.Location}`)
    return true;
  })
};

