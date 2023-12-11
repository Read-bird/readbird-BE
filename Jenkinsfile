pipeline {
    agent any
    tools {nodejs '18.18.0'}
    stages {
        stage('Build'){
            steps{
                discordSend description: ":tada: Jenkins Pipeline Build Start", footer: "CICD 빌드 배포 시작", title: JOB_NAME, webhookURL: "https://discord.com/api/webhooks/1183713768014889010/OXT-wS7_hVmlNl2w_mvK7t9Ojq8WuHTdJG9VKASE7dXEe2p_ppY2ztoy4gXF-Lw-xJeU"
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
                    discordSend description: "Jenkins Pipeline Build Test Complet", footer: "CICD 테스트 완료 / 잠시후 배포를 시작합니다.", title: JOB_NAME, webhookURL: "https://discord.com/api/webhooks/1183713768014889010/OXT-wS7_hVmlNl2w_mvK7t9Ojq8WuHTdJG9VKASE7dXEe2p_ppY2ztoy4gXF-Lw-xJeU"
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
            discordSend description: "Jenkins Pipeline Build Success", footer: "CICD 빌드 배포 성공 알림", result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "https://discord.com/api/webhooks/1183713768014889010/OXT-wS7_hVmlNl2w_mvK7t9Ojq8WuHTdJG9VKASE7dXEe2p_ppY2ztoy4gXF-Lw-xJeU"
        }
        failure {
            discordSend description: "Jenkins Pipeline Build Failed", footer: "CICD 빌드 배포 실패 알림", result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "https://discord.com/api/webhooks/1183713768014889010/OXT-wS7_hVmlNl2w_mvK7t9Ojq8WuHTdJG9VKASE7dXEe2p_ppY2ztoy4gXF-Lw-xJeU"
        }
    }
}