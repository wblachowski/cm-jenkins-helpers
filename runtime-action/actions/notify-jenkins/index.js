const axios = require('axios');
const { fetchAccessToken, isEventPipelineFinished, extractExecutionStatus, getPipelineId, getExecutionId } = require('./helpers')

async function main(params) {

  const accessToken = await fetchAccessToken(params)

  const event = params.event
  let dataToSend = undefined
  if (isEventPipelineFinished(event)) {
    dataToSend = await extractExecutionStatus(event, accessToken, params)
    const pipeline = getPipelineId(event)
    const execution = getExecutionId(event)
    await axios.post(`${params.JENKINS_WEBHOOK_URL}/${pipeline}-${execution}`, dataToSend)
  }
  return {
    statusCode: 200,
    body: dataToSend
  }
}

exports.main = main