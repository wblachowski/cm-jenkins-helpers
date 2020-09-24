const auth = require('@adobe/jwt-auth');
const fetch = require('node-fetch')
const FINISHED = 'https://ns.adobe.com/experience/cloudmanager/event/ended'
const EXECUTION = 'https://ns.adobe.com/experience/cloudmanager/pipeline-execution'
const PIPELINE_ID_REGEX = new RegExp("pipeline/([0-9]*)/execution")
const EXECUTION_ID_REGEX = new RegExp("execution/([0-9]*)")

async function fetchAccessToken(params) {
    const config = {
        clientId: params.CLIENT_ID,
        clientSecret: params.CLIENT_SECRET,
        technicalAccountId: params.TECHNICAL_ACCOUNT_EMAIL,
        orgId: params.ORGANIZATION_ID,
        privateKey: params.PRIVATE_KEY,
        metaScopes: [params.META_SCOPE]
    };

    const accessTokenJson = await auth(config);
    return accessTokenJson['access_token'];
}

async function extractExecutionStatus(event, accessToken, params) {
    const result = {};
    const stepsResults = await getStepsResults(event, accessToken, params)

    result.successful = resolvePipelineFinishStatus(stepsResults)
    result.steps = JSON.stringify([...stepsResults])

    return result;
}

function resolvePipelineFinishStatus(stepStatuses) {
    return !Array.from(stepStatuses.values()).includes('CANCELLED');
}

async function getStepsResults(event, accessToken, params) {
    const executionUrl = createExecutionUrl(event)
    const executionDetails = await makeApiCall(accessToken, executionUrl, params)

    return mapToStepDetails(executionDetails)
}

function createExecutionUrl(event) {
    const eventStepUrl = extractEventStepUrl(event)
    return eventStepUrl.split('/phase/')[0]
}

function mapToStepDetails(details) {
    const result = new Map()
    const stepStates = details['_embedded']['stepStates']
    stepStates.forEach(function (step) {
        if (step.status !== "NOT_STARTED") {
            result.set(step.action, step.status)
        }
    })
    return result
}

async function makeApiCall(accessToken, url, params) {
    const response = await fetch(url, {
        'headers': {
            'x-gw-ims-org-id': params.ORGANIZATION_ID,
            'x-api-key': params.CLIENT_ID,
            'authorization': accessToken
        }
    })
    return response.json()
}

function isEventPipelineFinished(event) {
    return event && FINISHED === event['@type'] &&
        EXECUTION === event['xdmEventEnvelope:objectType']
}

function getPipelineId(event) {
    return extractEventStepUrl(event).match(PIPELINE_ID_REGEX)[1];
}

function getExecutionId(event) {
    return extractEventStepUrl(event).match(EXECUTION_ID_REGEX)[1];
}

function extractEventStepUrl(event) {
    return event['activitystreams:object']['@id']
}

module.exports = {
    fetchAccessToken,
    isEventPipelineFinished,
    extractExecutionStatus,
    getPipelineId,
    getExecutionId
}
