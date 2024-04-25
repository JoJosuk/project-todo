<h1 align="center" id="title">Project Todo</h1>

<p align="center"><img src="https://socialify.git.ci/JoJosuk/project-todo/image?language=1&amp;name=1&amp;owner=1&amp;pattern=Charlie%20Brown&amp;stargazers=1&amp;theme=Dark" alt="project-image"></p>

<p id="description">Project Todo is a user-friendly project management tool that helps you stay organized and on top of your tasks. It provides a streamlined todo list interface, allowing you to efficiently create, manage, and track your projects.</p>

<h2>🚀 Demo</h2>

[https://cute-chimera-e2b29a.netlify.app/](https://cute-chimera-e2b29a.netlify.app/)

**Important Note**

  Because this project is currently deployed on free instances, you might experience slower startup times. Please be patient while the application loads.
  
<h2>🛠️ Installation Steps:</h2>
 
**1. Clone the Repository:**

```bash
git clone https://github.com/JoJosuk/project-todo
```

**2. Switch to the Docker Branch:**

```
git checkout docker
```
**3. Configure Environment Variables:**

 - Create a file named .env in the project's root directory.
 - Copy the contents from .env.sample into the newly created .env file.
 - Edit the values in the .env file to match your specific database configuration 
 - Please make sure that the postgres database url have password,database name and username configured. Use NEON to create an Online database and replace the url 
 - Make sure that the github usertoken has permission to Write gists. You can access the github token by creating one in developer option in settings
**4. Start Docker Compose:**

```bash
docker-compose up -d --build
```
 - The -d flag instructs Docker Compose to run the containers in detached mode, allowing them to operate in the background. The --build flag ensures that any Docker images required by the project are built before   starting the containers.

**5. Access the Application:**

  -  Open your web browser and navigate to http://localhost:8080/. You should see the Project Todo application running.

  
  
<h2>💻 Built with</h2>

Technologies used in the project:

*   React
*   PostgresSQL
*   Node
*   Express
