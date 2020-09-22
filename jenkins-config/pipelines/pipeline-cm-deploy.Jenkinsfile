pipeline {
    agent any

    stages {
        stage('Sync repos') {
            steps {
                build(job: 'sync-repos', propagate: true)
            }
        }
        stage('Trigger CM build'){
            steps{
                script{
                    output = sh (
                        script: 'script -c "aio cloudmanager:start-execution ${PIPELINE_ID}" -a',
                        returnStdout: true
                    ).trim()
                    EXECUTION_ID = output.find(/(?<=ID )\d+/)
                    if (!EXECUTION_ID){
                        error("Couldn't trigger CM build: ${OUTPUT}")
                    }
                    echo "execution ID is ${EXECUTION_ID}"
                }
            }
        }
        stage('Wait for the build to finish'){
            steps{
                script{
                    hook = registerWebhook(token: "${PIPELINE_ID}-${EXECUTION_ID}")
                    echo "Waiting for POST to ${hook.getURL()}"

                    data = waitForWebhook hook
                    dataJson = readJSON text: data
                    if(!dataJson['successful']){
                        error("CM deploy was unsuccessful: ${data}")
                    }
                }
            }
        }
        stage('Build finished'){
            steps{
                echo "CM build finished!"
            }
        }
    }
}
