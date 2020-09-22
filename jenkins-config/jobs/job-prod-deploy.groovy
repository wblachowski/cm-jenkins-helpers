import javaposse.jobdsl.dsl.DslFactory
DslFactory.newInstance().
pipelineJob('prod-deploy') {
    parameters {
        stringParam( "PIPELINE_ID", "@PROD_PIPELINE_ID@" )
    }
    definition {
        cps {
            script(new File('/usr/share/jenkins/ref/casc/pipelines/pipeline-cm-deploy.Jenkinsfile').text)
            sandbox()
        }
    }
}.displayName("Cloud Manager prod deploy")
