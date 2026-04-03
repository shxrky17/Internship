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

        stage('Build Backend') {
            steps {
                dir('backend/demo') {
                    // Using mvnw if available, else mvn
                    sh 'chmod +x mvnw'
                    sh './mvnw clean install -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend/demo') {
                    sh './mvnw test'
                }
            }
        }

        stage('Test Resume Main') {
            steps {
                dir('resume') {
                    sh 'python -m py_compile main.py'
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
