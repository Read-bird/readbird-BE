pipeline {
    agent any
    tools {nodejs '18.18.0'}
    stages {
        stage('Checkout') {
            steps {
                echo 'hello world'
            }
        }
        stage('Build'){
            steps{
                echo 'Build start'
                sh 'npm install'
                // sh 'npm run build'
                echo 'Build end'
            }
        }
    }
}