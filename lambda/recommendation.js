'use strict';

/**
 * Funcion principal para obtener las recomendaciones
 * @param {Object.USER_ID} event 
 */
module.exports.handler = async event => {
  try {
    const getRecommendations = await getRecommendations(event);
    return {
      statusCode: 200,
      body: JSON.stringify(
        getRecommendations,
        null,
        2
      ),
    };
  } catch (e) {
    console.error(e)
  }
};

/**
 * Get Recommendations
 * @param {Object.USER_ID} event 
 */
exports.getRecommendations = async (event) => {
  try {
    const { USER_ID } = event;
    const NUM_RECOMMENDATIONS = 10;
    const AWS = require('aws-sdk');
    const personalizeRuntime = new AWS.PersonalizeRuntime();
    const campaignARN = 'arn:aws:personalize:us-east-1:090793147312:campaign/tfm-camp'
    const params = {
      campaignArn: campaignARN,
      userId: USER_ID,
      numResults: NUM_RECOMMENDATIONS
    }
    const response = await personalizeRuntime.getRecommendations(params).promise()
    return response
  } catch (e) {
    console.error(e)
  }
}

