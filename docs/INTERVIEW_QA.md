# Interview Questions and Answers (Task 2: Jenkins Pipeline for CI/CD)

## 1. What is Jenkins, and how is it used in CI/CD?
Jenkins is an open-source **automation server** written in Java with more than a thousand plugins. It automates the
repeatable parts of software delivery. In CI/CD, Jenkins watches the source repository, and on every change it
**builds** the code, **runs the tests**, packages it (for example as a Docker image) and **deploys** it. It shows the
result of every step on a dashboard, so the team gets quick feedback. Jenkins has a **controller** (web UI and
scheduling) and optional **agents** (machines that run the jobs).

## 2. What is a Jenkinsfile?
A Jenkinsfile is a text file, stored in the project repository, that defines the pipeline as code (written in a
Groovy-based syntax). Because it lives in Git, the pipeline is versioned, reviewed and reproducible together with the
code ("Pipeline as Code"). Jenkins reads it with the job type *Pipeline script from SCM*.

## 3. How do you create and configure Jenkins pipelines?
1. Install Jenkins (and the tools the pipeline needs, here Docker and Git) and the Pipeline and Git plugins.
2. Write a `Jenkinsfile` in the repository (agent, stages, steps, post actions).
3. In Jenkins click **New Item**, choose **Pipeline**, set the definition to **Pipeline script from SCM**,
   enter the Git repository URL, the branch and the script path `Jenkinsfile`.
4. Configure the trigger: webhook (GitHub push), or `pollSCM`, or a schedule.
5. Run **Build Now** once and watch the **Stage View** and the **Console Output**.
Alternatives: paste the script directly into the job (*Pipeline script*) or use a *Multibranch Pipeline* which creates
a job for every branch automatically.

## 4. What are some common stages in a Jenkins pipeline?
**Checkout** (get the code), **Build** (compile or build the Docker image), **Test** (unit and integration tests),
**Code quality / security scan** (for example SonarQube, dependency check), **Package / Publish** (push the image
or artifact to a registry), **Deploy** (to staging or production), **Verify / smoke test**, and **Notify**
(email or chat). In this project: Checkout, Build, Test, Deploy, Verify.

## 5. What is the difference between a declarative and a scripted Jenkins pipeline?
| | Declarative | Scripted |
|---|---|---|
| Syntax | Structured, starts with `pipeline { }` and fixed sections (`agent`, `stages`, `steps`, `post`) | Free-form Groovy code, starts with `node { }` |
| Learning curve | Easier, simple and readable | Harder, needs Groovy knowledge |
| Features | Built-in `post`, `options`, `triggers`, `when`, validation of the syntax before the run | Full Groovy power, loops, complex logic and custom code |
| Typical use | Most projects (recommended) | Very complex or dynamic pipelines |

Declarative example:
```groovy
pipeline {
    agent any
    stages {
        stage('Build') { steps { sh 'docker build -t app .' } }
    }
}
```
Scripted example:
```groovy
node {
    stage('Build') {
        sh 'docker build -t app .'
    }
}
```
This project uses a **declarative** pipeline.
