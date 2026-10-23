// Declarative Jenkins pipeline: Checkout -> Build -> Test -> Deploy -> Verify
pipeline {
    agent any

    options {
        timeout(time: 10, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    // Trigger on every new commit: Jenkins checks the repository every 2 minutes.
    // For instant triggering install the "GitHub" plugin, add a GitHub webhook
    // and enable the githubPush() line below.
    triggers {
        pollSCM('H/2 * * * *')
        // githubPush()
    }

    environment {
        IMAGE_NAME     = 'jenkins-demo-app'
        CONTAINER_NAME = 'jenkins-demo-app'
        APP_PORT       = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git log -1 --pretty=format:"Commit: %h - %s (%an)"'
            }
        }

        stage('Build') {
            steps {
                echo 'Building the Docker image...'
                sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Test') {
            steps {
                echo 'Running the automated tests inside a Node.js container...'
                sh 'docker run --rm -u "$(id -u):$(id -g)" -v "$PWD":/app -w /app node:24-alpine node --test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying the new container...'
                sh '''
                    docker rm -f ${CONTAINER_NAME} || true
                    docker run -d --name ${CONTAINER_NAME} --restart unless-stopped \
                        -p ${APP_PORT}:3000 -e BUILD_NUMBER=${BUILD_NUMBER} \
                        ${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Verify') {
            steps {
                echo 'Checking that the application is healthy...'
                sh '''
                    for i in $(seq 1 15); do
                        if curl -fsS http://localhost:${APP_PORT}/health; then
                            echo
                            echo "Application is healthy"
                            exit 0
                        fi
                        echo "Waiting for the application ($i/15)"
                        sleep 2
                    done
                    docker logs ${CONTAINER_NAME}
                    exit 1
                '''
            }
        }
    }

    post {
        success {
            echo "Build #${env.BUILD_NUMBER} deployed successfully on port ${env.APP_PORT}"
        }
        failure {
            echo 'Pipeline failed - open the failed stage in the console output to see why'
        }
        always {
            sh 'docker image prune -f || true'
        }
    }
}
