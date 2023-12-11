pipeline {
    agent any
    tools {nodejs '18.18.0'}
    stages {
        stage('Build'){
            steps{
                echo 'Build start'
                sh 'npm install'
                echo 'Build end'
            }
        }
        stage('Sonarqube'){
            steps{
                script{
                        def scannerHome = tool 'sonarqube-scanner';
                        withSonarQubeEnv(credentialsId:"SONAR_TOKEN",installationName:'sonarqube-scanner') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
                echo 'Sonarqube out'
            }
        }
        stage('Test'){
            steps {
                script {
                    sh 'npm run test:coverage'
                }
            }
        }
        stage("Transfer") {
            steps([$class:"BapSshPromotionPublisherPlugin"]){
                script{
                    sshPublisher(
                        publishers:[
                            sshPublisherDesc(
                                configName:"nginx",
                                verbose:true,
                                transfers:[
                                    sshTransfer(
                                        remoteDirectory:"/conf.d",
                                        sourceFiles:"**/**",
                                        execCommand:"chmod +x /home/ec2-user/deploy/conf.d/deploy.sh"
                                    )
                                ],
                            )
                        ]
                    )
                }
            }

        }
         stage("Deploy") {
            steps([$class:"BapSshPromotionPublisherPlugin"]){
                script{
                    sshPublisher(
                        publishers:[
                            sshPublisherDesc(
                                configName:"nginx",
                                verbose:true,
                                transfers:[
                                    sshTransfer(
                                       execCommand:"/home/ec2-user/deploy/conf.d/deploy.sh"
                                    )
                                ]
                            )
                        ]
                    )
                }
            }
         }
    }
    post {
        success {
            discordSend description : "디스코드 CICD 알림",
                footer : "CICD 빌드가 성공하였습니다."
                title: "CICD Success",
                webhookURL: "https://discord.com/api/webhooks/1183713768014889010/OXT-wS7_hVmlNl2w_mvK7t9Ojq8WuHTdJG9VKASE7dXEe2p_ppY2ztoy4gXF-Lw-xJeU"
        }
        failure {
            discordSend description : "디스코드 CICD 알림",
                footer : "CICD 빌드가 실패하였습니다."
                title: "CICD Failed",
                webhookURL: "https://discord.com/api/webhooks/1183713768014889010/OXT-wS7_hVmlNl2w_mvK7t9Ojq8WuHTdJG9VKASE7dXEe2p_ppY2ztoy4gXF-Lw-xJeU"
        }
    }
}