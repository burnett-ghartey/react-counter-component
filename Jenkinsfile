pipeline {
  agent {
    docker { image 'node:16'}
  }

  stages {
    stage ('Checkout') {
      steps {
        echo 'passed'
        // git branch: 'main', url: 'https://github.com/burnett-ghartey/react-counter-component.git'
      }
    }

    stage ('Test') {
      steps {
          sh 'npm --version'
          sh 'chown -R 115:122 "/.npm"'
          sh 'npm install'
      }
    }

    stage ('Build') {
      steps {
        sh 'ls -ltr'
        // build the project
        sh 'npm run build'
      }
  }

    stage ('Static Code Analysis') {
      environment {
        SONAR_URL = 'http://34.207.153.2:9000/'
      }
      steps {
         withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
          sh 'npm install -D sonarqube-scanner'
          sh 'sonar-scanner -Dsonar.host.url=https://${SONAR_URL} -Dsonar.token=${SONAR_AUTH_TOKEN}'
        }
        
      }
    }

    stage ('Build and Push Docker Image') {
      environment {
        DOCKER_IMAGE = 'oneghartey/react-cicd:${BUILD_NUMBER}'
        REGISTRY_CREDENTIALS = credentials('docker-cred')
      }
      steps {
        script {
          sh 'docker build -t ${DOCKER_IMAGE} .'
          def dockerImage = docker.image("${DOCKER_IMAGE}")
          docker.withRegistry('https://index.docker.io/v1/', "docker-cred") {
                  dockerImage.push()
          }
        }
          
      }
    }

    stage ('Update Deployment File') {
      environment {
        GIT_REPO_NAME = 'react-counter-component'
        GIT_USER_NAME = 'burnett-ghartey'
      }
      steps {
        withCredentials([string(credentialsId: 'github', variable: 'GITHUB_TOKEN')]) {
           sh '''
                    git config user.email "00burnettghartey@gmail.com"
                    git config user.name "Burnett Ghartey"
                    BUILD_NUMBER=${BUILD_NUMBER}
                    sed -i "s/replaceImageTag/${BUILD_NUMBER}/g" deployment-manifests/deployment.yml
                    git add deployment-manifests/deployment.yml
                    git commit -m "Update deployment image to version ${BUILD_NUMBER}"
                    git push https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME} HEAD:main
                '''
        }
      }
    }
      
  }
}
