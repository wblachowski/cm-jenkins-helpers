import javaposse.jobdsl.dsl.DslFactory
DslFactory.newInstance().
pipelineJob('sync-repos') {
    definition {
        cps {
            script(new File('/usr/share/jenkins/ref/casc/pipelines/pipeline-sync-repos.Jenkinsfile').text)
            sandbox()
        }
    }
}.displayName("Sync repos")
