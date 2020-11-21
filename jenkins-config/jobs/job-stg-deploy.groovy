pipelineJob('stg-deploy') {
    parameters {
        stringParam( "PIPELINE_ID", "@STG_PIPELINE_ID@" )
    }
    definition {
        cps {
            script(new File('/usr/share/jenkins/ref/casc/pipelines/pipeline-cm-deploy.Jenkinsfile').text)
            sandbox()
        }
    }
}.displayName("Cloud Manager staging deploy")
