pipeline {
    agent any
    tools {nodejs '16.10.0'}
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
                sh 'npm run build'
                echo 'Build end'
            }
        }
    }
}