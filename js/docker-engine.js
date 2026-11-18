/**
 * Penguin Gym Linux - Virtual Docker Simulator
 */

class DockerEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.images = new Set(['hello-world']);
    this.imageTags = new Map([['hello-world', 'latest']]);
    this.imageIds = new Map([['hello-world', 'd2c94e258dcb']]);
    this.containers = new Map(); // id -> { id, name, image, status, ports, created }
    this.nextId = 1000;
  }

  getDeterministicImageId(imgName) {
    if (this.imageIds.has(imgName)) return this.imageIds.get(imgName);
    let h = 0x811c9dc5;
    for (let i = 0; i < imgName.length; i++) {
      h = Math.imul(h ^ imgName.charCodeAt(i), 16777619);
    }
    const id = (Math.abs(h).toString(16) + 'a9b0c1d2e3f4').slice(0, 12);
    this.imageIds.set(imgName, id);
    return id;
  }

  registerImage(rawRef) {
    const [repo, tag = 'latest'] = rawRef.split(':');
    this.images.add(repo);
    this.imageTags.set(repo, tag);
    this.getDeterministicImageId(repo);
    return { repo, tag };
  }

  execute(args, fs = null) {
    if (!args || args.length === 0) {
      return { output: 'Uso: docker <subcomando> [opções]\nSubcomandos: pull, images, build, run, start, restart, ps, logs, exec, inspect, stop, rm, rmi', type: 'error', code: 1 };
    }

    const sub = args[0];
    const rest = args.slice(1);

    const findContainer = (target) => {
      for (const [id, c] of this.containers.entries()) {
        if (c.id === target || c.name === target || c.id.startsWith(target)) return [id, c];
      }
      return null;
    };

    switch (sub) {
      case 'pull': {
        const image = rest[0];
        if (!image) return { output: '"docker pull" requer exatamente 1 argumento.', type: 'error', code: 1 };
        const [cleanImg, tag = 'latest'] = image.split(':');
        const isNew = !this.images.has(cleanImg);
        this.registerImage(image);
        return {
          output: `Using default tag: ${tag}
${tag}: Pulling from library/${cleanImg}
2b44b475e76d: Pull complete 
Digest: sha256:7d246653d0511db2a6b2372479d737b4f0ea615a4fb5967af3c794be84292042
Status: ${isNew ? 'Downloaded newer image' : 'Image is up to date'} for ${cleanImg}:${tag}
docker.io/library/${cleanImg}:${tag}`,
          code: 0
        };
      }

      case 'images': {
        const header = 'REPOSITORY          TAG       IMAGE ID       CREATED        SIZE';
        const rows = Array.from(this.images).map(img => {
          const tag = this.imageTags.get(img) || 'latest';
          const id = this.getDeterministicImageId(img);
          return `${img.padEnd(20)}${tag.padEnd(10)}${id}   2 days ago     13.3MB`;
        });
        return { output: [header, ...rows].join('\n'), code: 0 };
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
          } else if ((arg === '--name') && rest[i + 1]) {
            name = rest[++i];
          } else if (arg.startsWith('--name=')) {
            name = arg.slice(7);
          } else if ((arg === '-p' || arg === '--publish') && rest[i + 1]) {
            ports = rest[++i];
          } else if (arg.startsWith('--publish=')) {
            ports = arg.slice(10);
          } else if (arg.startsWith('-p') && arg.length > 2) {
            ports = arg.slice(2);
          } else if (arg.startsWith('-') && !arg.startsWith('--') && arg.length > 1) {
            if (arg.includes('d')) isDetached = true;
            if (arg.includes('p') && rest[i + 1]) ports = rest[++i];
          } else if (!arg.startsWith('-')) {
            image = arg;
            break;
          }
        }

        if (!image) return { output: '"docker run" requer ao menos o nome de uma imagem.', type: 'error', code: 1 };
        const { repo } = this.registerImage(image);

        const cid = Math.random().toString(16).substring(2, 14);
        name = name || 'container_' + cid.substring(0, 4);

        if (repo === 'hello-world') {
          this.containers.set(cid, {
            id: cid,
            name,
            image: repo,
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
 4. The Docker daemon streamed that output to the Docker client.`,
            code: 0
          };
        }

        let formattedPort = '';
        if (ports) {
          if (ports.includes(':')) {
            const [hostPort, contPort] = ports.split(':');
            formattedPort = `0.0.0.0:${hostPort}->${contPort}/tcp`;
          } else {
            formattedPort = `0.0.0.0:${ports}->80/tcp`;
          }
        }

        this.containers.set(cid, {
          id: cid,
          name,
          image: repo,
          status: isDetached ? 'Up 5 seconds' : 'Exited (0) Just now',
          ports: formattedPort,
          created: 'Just now'
        });

        if (isDetached) {
          return { output: cid + '89a9f24b898124b897129487', code: 0 };
        }
        return { output: `[${name}] Container iniciado com sucesso.`, code: 0 };
      }

      case 'ps': {
        const all = rest.includes('-a') || rest.includes('--all');
        const header = 'CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                     NAMES';
        const items = Array.from(this.containers.values()).filter(c => all || c.status.startsWith('Up'));
        if (items.length === 0) {
          return { output: header, code: 0 };
        }
        const rows = items.map(c => {
          return `${c.id.padEnd(15)}${c.image.padEnd(15)}"entrypoint.sh"          ${c.created.padEnd(16)}${c.status.padEnd(15)}${(c.ports || '').padEnd(26)}${c.name}`;
        });
        return { output: [header, ...rows].join('\n'), code: 0 };
      }

      case 'start':
      case 'restart': {
        const target = rest.find(r => !r.startsWith('-'));
        if (!target) return { output: `"docker ${sub}" requer ao menos 1 container.`, type: 'error', code: 1 };
        const found = findContainer(target);
        if (!found) return { output: `Error: No such container: ${target}`, type: 'error', code: 1 };
        found[1].status = 'Up 2 seconds';
        return { output: target, code: 0 };
      }

      case 'stop': {
        const target = rest.find(r => !r.startsWith('-'));
        if (!target) return { output: '"docker stop" requer ao menos 1 container.', type: 'error', code: 1 };
        const found = findContainer(target);
        if (!found) return { output: `Error: No such container: ${target}`, type: 'error', code: 1 };
        found[1].status = 'Exited (0) Just now';
        return { output: target, code: 0 };
      }

      case 'rm': {
        const force = rest.includes('-f') || rest.includes('--force');
        const target = rest.find(r => !r.startsWith('-'));
        if (!target) return { output: '"docker rm" requer ao menos 1 container.', type: 'error', code: 1 };
        const found = findContainer(target);
        if (!found) return { output: `Error: No such container: ${target}`, type: 'error', code: 1 };
        const [id, c] = found;
        if (c.status.startsWith('Up') && !force) {
          return {
            output: `Error response from daemon: You cannot remove a running container ${c.id}. Stop the container before attempting removal or force remove`,
            type: 'error',
            code: 1
          };
        }
        this.containers.delete(id);
        return { output: target, code: 0 };
      }

      case 'rmi': {
        const force = rest.includes('-f') || rest.includes('--force');
        const rawTarget = rest.find(r => !r.startsWith('-'));
        if (!rawTarget) return { output: '"docker rmi" requer o nome da imagem.', type: 'error', code: 1 };
        const target = rawTarget.split(':')[0];
        if (!this.images.has(target) && !this.images.has(rawTarget)) {
          return { output: `Error: No such image: ${rawTarget}`, type: 'error', code: 1 };
        }
        const imgKey = this.images.has(rawTarget) ? rawTarget : target;
        const inUse = Array.from(this.containers.values()).find(c => c.image === imgKey || c.image.split(':')[0] === target);
        if (inUse && !force) {
          return {
            output: `Error response from daemon: conflict: unable to remove repository reference "${rawTarget}" (must force) - container ${inUse.id} is using its referenced image`,
            type: 'error',
            code: 1
          };
        }
        const prevTag = this.imageTags.get(imgKey) || 'latest';
        this.images.delete(imgKey);
        this.imageTags.delete(imgKey);
        return { output: `Untagged: ${target}:${prevTag}\nDeleted: sha256:7d246653d0511db2a6b`, code: 0 };
      }

      case 'inspect': {
        const target = rest.find(r => !r.startsWith('-'));
        if (!target) return { output: '"docker inspect" requer o nome ou ID do objeto.', type: 'error', code: 1 };
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
            }], null, 2),
            code: 0
          };
        }
        const repoKey = target.split(':')[0];
        if (this.images.has(repoKey)) {
          const tag = this.imageTags.get(repoKey) || 'latest';
          return {
            output: JSON.stringify([{ RepoTags: [`${repoKey}:${tag}`], Architecture: 'amd64', Os: 'linux' }], null, 2),
            code: 0
          };
        }
        return { output: `Error: No such object: ${target}`, type: 'error', code: 1 };
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
            return { output: `ERROR: failed to solve: failed to read dockerfile: open ${dfPath}: no such file or directory`, type: 'error', code: 1 };
          }
        }
        this.registerImage(tag);
        const steps = dockerfileContent
          .split('\n')
          .map(l => l.trim())
          .filter(l => l && !l.startsWith('#'));
        const stepLines = (steps.length > 0 ? steps : ['FROM alpine:latest']).map((s, idx) => `#${idx + 1} [${idx + 1}/${Math.max(1, steps.length)}] ${s}\n#${idx + 1} DONE 0.1s`);
        return {
          output: `${stepLines.join('\n')}\nSuccessfully built 8a9b0c1d2e3f\nSuccessfully tagged ${tag}`,
          code: 0
        };
      }

      case 'logs': {
        const target = rest.find(r => !r.startsWith('-'));
        if (!target) return { output: '"docker logs" requer ao menos 1 container.', type: 'error', code: 1 };
        const found = findContainer(target);
        if (!found) return { output: `Error: No such container: ${target}`, type: 'error', code: 1 };
        const c = found[1];
        if (c.image.includes('nginx')) {
          return {
            output: `/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration\n/docker-entrypoint.sh: Configuration complete; ready for start up\n2026/01/15 10:30:00 [notice] 1#1: using the "epoll" event method\n2026/01/15 10:30:00 [notice] 1#1: nginx/1.25.3\n2026/01/15 10:30:00 [notice] 1#1: start worker processes\n127.0.0.1 - - [15/Jan/2026:10:31:02 +0000] "GET / HTTP/1.1" 200 615 "-"`,
            code: 0
          };
        }
        if (c.image.includes('hello-world')) {
          return {
            output: `Hello from Docker!\nThis message shows that your installation appears to be working correctly.`,
            code: 0
          };
        }
        return { output: `[${c.name}] Container log stream initialized.\n[${c.name}] Service running smoothly on port ${c.ports || 'internal'}.`, code: 0 };
      }

      case 'exec': {
        const clean = [];
        let parsingCmd = false;
        for (let i = 0; i < rest.length; i++) {
          const r = rest[i];
          if (!parsingCmd && r.startsWith('-')) {
            if ((r === '-u' || r === '--user' || r === '-e' || r === '--env' || r === '-w' || r === '--workdir') && rest[i + 1]) {
              i++;
            }
            continue;
          }
          parsingCmd = true;
          clean.push(r);
        }
        const target = clean[0];
        const cmdTokens = clean.slice(1);
        if (!target) return { output: '"docker exec" requer o ID ou nome do container.', type: 'error', code: 1 };
        const found = findContainer(target);
        if (!found) return { output: `Error: No such container: ${target}`, type: 'error', code: 1 };
        const c = found[1];
        if (c.status.startsWith('Exited')) {
          return { output: `Error: Container ${target} is not running`, type: 'error', code: 1 };
        }
        const innerCmd = cmdTokens.length > 0 ? cmdTokens.join(' ') : 'uname -a';
        const shortId = c.id.slice(0, 12);
        if (innerCmd === 'bash' || innerCmd === 'sh') {
          return { output: `root@${shortId}:/# `, code: 0 };
        }
        if (innerCmd === 'uname -a') {
          return { output: `Linux ${shortId} 6.1.0-21-amd64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`, code: 0 };
        }
        if (innerCmd === 'uname' || innerCmd === 'uname -s') return { output: 'Linux', code: 0 };
        if (innerCmd === 'uname -r') return { output: '6.1.0-21-amd64', code: 0 };
        if (innerCmd === 'uname -m') return { output: 'x86_64', code: 0 };
        if (innerCmd === 'uname -n') return { output: shortId, code: 0 };
        if (innerCmd === 'whoami') return { output: 'root', code: 0 };
        if (innerCmd === 'pwd') return { output: '/', code: 0 };
        if (innerCmd === 'hostname') return { output: shortId, code: 0 };
        if (innerCmd.startsWith('echo ')) return { output: cmdTokens.slice(1).join(' '), code: 0 };
        if (innerCmd === 'ls' || innerCmd === 'ls -la') {
          return { output: 'bin  boot  dev  etc  home  lib  proc  root  run  sbin  tmp  usr  var', code: 0 };
        }
        return { output: `Executado no container ${c.name}: ${innerCmd}`, code: 0 };
      }

      default:
        return { output: `docker: '${sub}' não é um comando docker.`, type: 'error', code: 1 };
    }
  }
}

if (typeof window !== 'undefined') {
  window.DockerEngine = DockerEngine;
}
