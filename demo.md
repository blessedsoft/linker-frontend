# Frontend Demo (Docker + Kubernetes)

This guide shows how to run the Next.js frontend in a container locally and in a Kubernetes cluster.

## Prereqs
- Docker Desktop or Docker Engine
- kubectl (for Kubernetes)
- A Kubernetes cluster (kind, minikube, or a remote cluster)

## Important Note About `NEXT_PUBLIC_API_URL`
`NEXT_PUBLIC_*` variables are baked into the client bundle at build time. That means:
- The value must be present when the image is built.
- Setting `-e NEXT_PUBLIC_API_URL=...` at `docker run` time will not update the client bundle.

Make sure your `.env` file is set before building the image.

## Docker (local)
### 1) Create the shared network
```bash
docker network create linker-net
```

1. Create or update the root `.env` file:
   ```bash
   cp .env.example .env
   ```
   Then set:
   ```env
   NEXT_PUBLIC_API_URL=http://backend:3001/api
   ```

2. Run the backend on the same network (example):
   ```bash
   docker run --rm --name backend --network linker-net -p 3001:3001 <your-backend-image>
   ```

3. Run the frontend container on the same network:
   ```bash
   docker run --rm -p 3000:3000 --name linker-frontend --network linker-net blessedsoft/devops-app-frontend:latest
   ```

4. Open:
   - `http://localhost:3000`

## Docker Compose (frontend only)
If you want only the frontend service (local build):
```bash
docker compose up --build frontend
```

## Rebuild + Push to Docker Hub
If you changed the frontend code or `.env` and need a new image:
```bash
docker build -t blessedsoft/devops-app-frontend:latest .
docker push blessedsoft/devops-app-frontend:latest
```

## Pull from Docker Hub
```bash
docker pull blessedsoft/devops-app-frontend:latest
```

## Kubernetes (local cluster)
### 1) Load the image into your cluster
Pick one option depending on your cluster:

kind:
```bash
docker pull blessedsoft/devops-app-frontend:latest
kind load docker-image blessedsoft/devops-app-frontend:latest
```

minikube:
```bash
minikube image load blessedsoft/devops-app-frontend:latest
```

Remote cluster:
```bash
# Image is already in a remote registry. No extra steps needed.
```

### 2) Apply manifests
Create a file named `k8s-frontend.yaml` with the following content:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: linker-frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: linker-frontend
  template:
    metadata:
      labels:
        app: linker-frontend
    spec:
      containers:
        - name: linker-frontend
          image: blessedsoft/devops-app-frontend:latest
          imagePullPolicy: Always
          ports:
            - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: linker-frontend
spec:
  selector:
    app: linker-frontend
  ports:
    - port: 3000
      targetPort: 3000
  type: ClusterIP
```

Apply it:
```bash
kubectl apply -f k8s-frontend.yaml
```

### 3) Access the app
Port-forward to your local machine:
```bash
kubectl port-forward service/linker-frontend 3000:3000
```
Then open `http://localhost:3000`.

## Troubleshooting
- If API calls fail, confirm `NEXT_PUBLIC_API_URL` was set in `.env` before building the image.
- If you changed `.env`, rebuild the Docker image so the new value is baked in.
