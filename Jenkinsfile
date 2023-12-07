pipeline {
    agent any
    tools {nodejs '18.18.0'}
    stages {
        stage('Build'){
            steps{
                echo 'Build start'
                sh 'npm install'
                // sh 'npm run build'
                echo 'Build end'
            }
        }
        stage('Sonarqube'){
            steps{
                        def scannerHome = tool 'sonarqube-scanner';
                        withSonarQubeEnv(credentialsId:'SONAR_TOKEN',installationName:'sonarqube-scanner') {
                        sh "${scannerHome}/bin/sonar-scanner"
                }
                echo 'Sonarqube out'
            }
        }
    }
}