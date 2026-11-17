/**
 * Penguin Gym Linux - Virtual Docker Simulator
 */

class DockerEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.images = new Set(['hello-world']);
    this.containers = new Map(); // id -> { id, name, image, status, ports, created }
    this.nextId = 1000;
  }

  execute(args, fs = null) {
    if (!args || args.length === 0) {
      return { output: 'Uso: docker <subcomando> [opções]\nSubcomandos: pull, images, build, run, start, restart, ps, logs, exec, inspect, stop, rm, rmi', type: 'error' };
    }

    const sub = args[0];
    const rest = args.slice(1);

    const findContainer = (target) => {
      for (const [id, c] of this.containers.entries()) {
        if (c.id === target || c.name === target) return [id, c];
      }
      return null;
    };

    switch (sub) {
      case 'pull': {
        const image = rest[0];
        if (!image) return { output: '"docker pull" requer exatamente 1 argumento.', type: 'error' };
        const cleanImg = image.split(':')[0];
        const isNew = !this.images.has(cleanImg);
        this.images.add(cleanImg);
        return {
          output: `Using default tag: latest
latest: Pulling from library/${cleanImg}
2b44b475e76d: Pull complete 
Digest: sha256:7d246653d0511db2a6b2372479d737b4f0ea615a4fb5967af3c794be84292042
Status: ${isNew ? 'Downloaded newer image' : 'Image is up to date'} for ${cleanImg}:latest
docker.io/library/${cleanImg}:latest`
        };
      }

      case 'images': {
        const header = 'REPOSITORY          TAG       IMAGE ID       CREATED        SIZE';
        const rows = Array.from(this.images).map(img => {
          const id = Math.random().toString(16).substring(2, 14);
          return `${img.padEnd(20)}latest    ${id}   2 days ago     13.3MB`;
        });
        return { output: [header, ...rows].join('\n') };
      }

      case 'run': {
        let isDetached = false;
        let name = null;
        let ports = null;
        let image = null;

        for (let i = 0; i < rest.length; i++) {
          const arg = rest[i];
          if (arg === '-d' || arg === '--detach') {
            isDetached = true;
          } else if (arg === '--name' && rest[i + 1]) {
            name = rest[++i];
          } else if (arg === '-p' && rest[i + 1]) {
            ports = rest[++i];
          } else if (!arg.startsWith('-')) {
            image = arg;
            break;
          }
        }

        if (!image) return { output: '"docker run" requer ao menos o nome de uma imagem.', type: 'error' };
        this.images.add(image);

        const cid = Math.random().toString(16).substring(2, 14);
        name = name || 'container_' + cid.substring(0, 4);

        if (image === 'hello-world') {
          this.containers.set(cid, {
            id: cid,
            name,
            image,
            status: 'Exited (0) Just now',
            ports: '',
            created: 'Just now'
          });
          return {
            output: `Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image.
 4. The Docker daemon streamed that output to the Docker client.`
          };
        }

        this.containers.set(cid, {
          id: cid,
          name,
          image,
          status: isDetached ? 'Up 5 seconds' : 'Exited (0) Just now',
          ports: ports ? (ports.includes(':') ? `0.0.0.0:${ports}/tcp` : `0.0.0.0:${ports}->80/tcp`) : '',
          created: 'Just now'
        });

        if (isDetached) {
          return { output: cid + '89a9f24b898124b897129487' };
        }
        return { output: `[${name}] Container iniciado com sucesso.` };
      }

      case 'ps': {
        const all = rest.includes('-a') || rest.includes('--all');
        const header = 'CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                     NAMES';
        const items = Array.from(this.containers.values()).filter(c => all || c.status.startsWith('Up'));
        if (items.length === 0) {
          return { output: header };
        }
        const rows = items.map(c => {
          return `${c.id.padEnd(15)}${c.image.padEnd(15)}"entrypoint.sh"          ${c.created.padEnd(16)}${c.status.padEnd(15)}${(c.ports || '').padEnd(26)}${c.name}`;
        });
        return { output: [header, ...rows].join('\n') };
      }

      case 'start':
      case 'restart': {
        const target = rest.find(r => !r.startsWith('-'));
        if (!target) return { output: `"docker ${sub}" requer ao menos 1 container.`, type: 'error' };
        const found = findContainer(target);
        if (!found) return { output: `Error: No such container: ${target}`, type: 'error' };
        found[1].status = 'Up 2 seconds';
        return { output: target };
      }

      case 'stop': {
        const target = rest[0];
        if (!target) return { output: '"docker stop" requer ao menos 1 container.', type: 'error' };
        const found = findContainer(target);
        if (!found) return { output: `Error: No such container: ${target}`, type: 'error' };
        found[1].status = 'Exited (0) Just now';
        return { output: target };
      }

      case 'rm': {
        const force = rest.includes('-f') || rest.includes('--force');
        const target = rest.find(r => !r.startsWith('-'));
        if (!target) return { output: '"docker rm" requer ao menos 1 container.', type: 'error' };
        const found = findContainer(target);
        if (!found) return { output: `Error: No such container: ${target}`, type: 'error' };
        const [id, c] = found;
        if (c.status.startsWith('Up') && !force) {
          return {
            output: `Error response from daemon: You cannot remove a running container ${c.id}. Stop the container before attempting removal or force remove`,
            type: 'error'
          };
        }
        this.containers.delete(id);
        return { output: target };
      }

      case 'rmi': {
        const force = rest.includes('-f') || rest.includes('--force');
        const rawTarget = rest.find(r => !r.startsWith('-'));
        if (!rawTarget) return { output: '"docker rmi" requer o nome da imagem.', type: 'error' };
        const target = rawTarget.split(':')[0];
        if (!this.images.has(target) && !this.images.has(rawTarget)) {
          return { output: `Error: No such image: ${rawTarget}`, type: 'error' };
        }
        const imgKey = this.images.has(rawTarget) ? rawTarget : target;
        const inUse = Array.from(this.containers.values()).find(c => c.image === imgKey || c.image.split(':')[0] === target);
        if (inUse && !force) {
          return {
            output: `Error response from daemon: conflict: unable to remove repository reference "${rawTarget}" (must force) - container ${inUse.id} is using its referenced image`,
            type: 'error'
          };
        }
        this.images.delete(imgKey);
        return { output: `Untagged: ${rawTarget}:latest\nDeleted: sha256:7d246653d0511db2a6b` };
      }

      case 'inspect': {
        const target = rest.find(r => !r.startsWith('-'));
        if (!target) return { output: '"docker inspect" requer o nome ou ID do objeto.', type: 'error' };
        const found = findContainer(target);
        if (found) {
          const [, c] = found;
          return {
            output: JSON.stringify([{
              Id: c.id,
              Name: '/' + c.name,
              State: { Status: c.status.startsWith('Up') ? 'running' : 'exited', Running: c.status.startsWith('Up') },
              Config: { Image: c.image },
              NetworkSettings: { Ports: c.ports || {} }
            }], null, 2)
          };
        }
        if (this.images.has(target)) {
          return {
            output: JSON.stringify([{ RepoTags: [`${target}:latest`], Architecture: 'amd64', Os: 'linux' }], null, 2)
          };
        }
        return { output: `Error: No such object: ${target}`, type: 'error' };
      }

      case 'build': {
        let tag = 'custom-image:latest';
        let contextPath = '.';
        for (let i = 0; i < rest.length; i++) {
          if ((rest[i] === '-t' || rest[i] === '--tag') && rest[i + 1]) {
            tag = rest[++i];
          } else if (!rest[i].startsWith('-')) {
            contextPath = rest[i];
          }
        }
        const dfPath = contextPath === '.' ? 'Dockerfile' : `${contextPath.replace(/\/$/, '')}/Dockerfile`;
        let dockerfileContent = '';
        if (fs) {
          try {
            dockerfileContent = fs.readFile(dfPath);
          } catch {
            return { output: `ERROR: failed to solve: failed to read dockerfile: open ${dfPath}: no such file or directory`, type: 'error' };
          }
        }
        const imgName = tag.split(':')[0];
        this.images.add(imgName);
        const steps = dockerfileContent
          .split('\n')
          .map(l => l.trim())
          .filter(l => l && !l.startsWith('#'));
        const stepLines = (steps.length > 0 ? steps : ['FROM alpine:latest']).map((s, idx) => `#${idx + 1} [${idx + 1}/${Math.max(1, steps.length)}] ${s}\n#${idx + 1} DONE 0.1s`);
        return {
          output: `${stepLines.join('\n')}\nSuccessfully built 8a9b0c1d2e3f\nSuccessfully tagged ${tag}`
        };
      }

      case 'logs': {
        const target = rest.find(r => !r.startsWith('-'));
        if (!target) return { output: '"docker logs" requer ao menos 1 container.', type: 'error' };
        const c = Array.from(this.containers.values()).find(item => item.id === target || item.name === target);
        if (!c) return { output: `Error: No such container: ${target}`, type: 'error' };
        if (c.image.includes('nginx')) {
          return {
            output: `/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration\n/docker-entrypoint.sh: Configuration complete; ready for start up\n2026/01/15 10:30:00 [notice] 1#1: using the "epoll" event method\n2026/01/15 10:30:00 [notice] 1#1: nginx/1.25.3\n2026/01/15 10:30:00 [notice] 1#1: start worker processes\n127.0.0.1 - - [15/Jan/2026:10:31:02 +0000] "GET / HTTP/1.1" 200 615 "-"`
          };
        }
        if (c.image.includes('hello-world')) {
          return {
            output: `Hello from Docker!\nThis message shows that your installation appears to be working correctly.`
          };
        }
        return { output: `[${c.name}] Container log stream initialized.\n[${c.name}] Service running smoothly on port ${c.ports || 'internal'}.` };
      }

      case 'exec': {
        const clean = rest.filter(r => r !== '-it' && r !== '-i' && r !== '-t' && r !== '-d');
        const target = clean[0];
        const cmdTokens = clean.slice(1);
        if (!target) return { output: '"docker exec" requer o ID ou nome do container.', type: 'error' };
        const c = Array.from(this.containers.values()).find(item => item.id === target || item.name === target);
        if (!c) return { output: `Error: No such container: ${target}`, type: 'error' };
        if (c.status.startsWith('Exited')) {
          return { output: `Error: Container ${target} is not running`, type: 'error' };
        }
        const innerCmd = cmdTokens.length > 0 ? cmdTokens.join(' ') : 'uname -a';
        if (innerCmd === 'bash' || innerCmd === 'sh') {
          return { output: `root@${c.id.slice(0, 12)}:/# ` };
        }
        if (innerCmd === 'uname -a' || innerCmd === 'uname') {
          return { output: 'Linux ' + c.id.slice(0, 12) + ' 6.1.0-21-amd64 #1 SMP x86_64 GNU/Linux' };
        }
        return { output: `Executado no container ${c.name}: ${innerCmd}` };
      }

      default:
        return { output: `docker: '${sub}' não é um comando docker.`, type: 'error' };
    }
  }
}

if (typeof window !== 'undefined') {
  window.DockerEngine = DockerEngine;
}
