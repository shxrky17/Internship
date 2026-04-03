pipeline {
    agent any

    tools {
        maven 'Maven 3.8.6'
        nodejs 'node 18'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
stage('Check Python') {
    steps {
        bat 'where py'
        bat 'py --version'
    }
}
        stage('Build Backend') {
            steps {
                dir('backend/demo') {
                    bat 'mvnw.cmd clean install -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }
        stage('Build python backend') {
            steps {
                dir('resume') {
                    bat 'py -m py_compile main.py'
                }
            }
        }


        stage('Test Backend') {
            steps {
                dir('backend/demo') {
                    bat 'mvnw.cmd test'
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'backend/demo/target/*.jar, frontend/dist/**', fingerprint: true
            }
        }
    }

    post {
        always {
            echo 'Build completed.'
        }
        success {
            echo 'Build success!'
        }
        failure {
            echo 'Build failed.'
        }
    }
}