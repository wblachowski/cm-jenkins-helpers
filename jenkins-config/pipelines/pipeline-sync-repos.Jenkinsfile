pipeline {
    agent any

    environment {
        DEV_REPO_URL = "@DEV_REPO_URL@"
        DEV_REPO_BUILD_BRANCH = "@DEV_REPO_BRANCH@"
        DEV_REPO_CREDENTIALS_ID = "dev-repo-credentials"

        ADOBE_REPO_URL = "@ADOBE_REPO_URL@"
        ADOBE_REPO_BUILD_BRANCH = "@ADOBE_REPO_BRANCH@"
        ADOBE_REPO_CREDENTIALS_ID = "adobe-repo-credentials"
    }

    stages {
        stage("Checkout code from the dev repo") {
            steps {
                dir("codebase") {
                    deleteDir()
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: env.DEV_REPO_BUILD_BRANCH]],
                        userRemoteConfigs: [[credentialsId: env.DEV_REPO_CREDENTIALS_ID, url: env.DEV_REPO_URL]]
                    ])
                }
            }
        }
        stage('Done') {
            steps {
                sh 'echo "Done"'
            }
        }

        stage("Push the codebase from the dev repo to the remote Adobe repo") {
           steps {
                dir("codebase") {
                    sh "git checkout ${DEV_REPO_BUILD_BRANCH}"

                    withCredentials(
                        [
                            usernamePassword(credentialsId: env.ADOBE_REPO_CREDENTIALS_ID, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')
                        ]
                    ) {
                        sh "git remote add -f -t ${ADOBE_REPO_BUILD_BRANCH} adobe-origin https://${GIT_USERNAME}:${GIT_PASSWORD}@${ADOBE_REPO_URL}"
                    }

                    sh "git fetch adobe-origin"
                    sh "git push adobe-origin HEAD:${ADOBE_REPO_BUILD_BRANCH}"
                    sh "git push adobe-origin --tags HEAD:${ADOBE_REPO_BUILD_BRANCH}"
                }
           }
        }
    }
}