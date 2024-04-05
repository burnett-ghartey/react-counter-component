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
      environement {
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
        sh 'docker build -t ${DOCKER_IMAGE} .'
        def dockerImage = docker.image("${DOCKER_IMAGE}")
        docker.WithRegistry('https://index.docker.io/v1/', 'docker-cred') {
          dockerImage.push()
        }
          
      }
    }

    stage ('')
      
}
