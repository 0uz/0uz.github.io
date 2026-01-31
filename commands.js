let runningApps = {
    springBoot: false,
    goApp: false,
    infrastructure: false
};

const commandCompletions = {
    'curl': ['localhost:8080/api/profile', 'localhost:8080/api/experience', 'localhost:8080/api/projects', 'localhost:8080/api/links', 'localhost:8080/api/health', 'localhost:8080/api/metrics'],
    'docker': ['compose up', 'run -d springapp', 'run -d goapp', 'ps'],
    'psql': ['-h localhost -U postgres -d portfolio'],
    'redis-cli': ['ping', 'monitor', 'info'],
    'kafka-topics': ['--list'],
    'git': ['log'],
    'sudo': ['make me a coffee']
};

const fileSystem = {
    'projects/': {
        'user-service/': {
            'pom.xml': 'Maven project file',
            'src/': {
                'main/': {
                    'UserService.java': 'Spring Boot main application',
                    'UserController.java': 'REST endpoints'
                }
            }
        },
        'websocket-service/': {
            'main.go': 'Go WebSocket server',
            'handlers.go': 'WebSocket handlers'
        }
    },
    'config/': {
        'application.yml': 'Spring configuration',
        'kubernetes/': {
            'deployment.yml': 'K8s deployment config'
        }
    }
};

let currentDirectory = '/';

// Yardımcı fonksiyonlar
function getCurrentTimestamp(addSeconds = 0) {
    const now = new Date();
    now.setSeconds(now.getSeconds() + addSeconds);
    return now.toLocaleString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
    }).replace(',', '');
}

function getCurrentDate() {
    return new Date().toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// writeLine fonksiyonu - terminal output helper
function writeLine(text = '') {
    const lines = text.split('\n');
    lines.forEach((line, index) => {
        if (index > 0) term.write('\r\n');
        term.write('\x1b[38;5;252m' + line + '\x1b[0m');
    });
    term.write('\r\n');
}

// simulateLoading fonksiyonu - loading animation
function simulateLoading(message, duration = 1000) {
    return new Promise(resolve => {
        const frames = ['-', '\\', '|', '/'];
        let i = 0;
        term.write(message);
        
        const interval = setInterval(() => {
            term.write('\b' + frames[i++ % frames.length]);
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            term.write('\b \n');
            resolve();
        }, duration);
    });
}

// Link formatlamak için yardımcı fonksiyon güncellendi
function formatLink(url) {
    // OSC 8 formatını kullan (xterm.js tarafından desteklenen format)
    return `\x1b]8;;${url}\x07${url}\x1b]8;;\x07`;
}

// colorizeJson fonksiyonunu güncelle
function colorizeJson(json) {
    const jsonString = JSON.stringify(json, null, 2);
    const lines = jsonString.split('\n');
    const colorizedLines = lines.map(line => {
        if (line.includes(':')) {
            // Key'leri ve değerleri ayır
            const [keyPart, ...valueParts] = line.split(':');
            const valuePart = valueParts.join(':');
            
            // Key'i mavi yap
            const coloredKey = keyPart.replace(/"([^"]+)"/, '\x1b[94m"$1"\x1b[0m');
            
            // String değeri yeşil yap
            const coloredValue = valuePart.replace(/"([^"]+)"/, '\x1b[92m"$1"\x1b[0m');
            
            return coloredKey + ':' + coloredValue;
        } else {
            // Array elemanlarını veya diğer string değerleri yeşil yap
            return line.replace(/"([^"]+)"/, '\x1b[92m"$1"\x1b[0m');
        }
    });

    return colorizedLines.join('\n');
}

const commands = {
    'docker': async (args) => {
        if (args[0] === 'compose' && args[1] === 'up') {
            if (runningApps.infrastructure) {
                writeLine('Infrastructure is already running.\n');
                term.write(terminalState.prompt);
                return;
            }
            
            writeLine('Starting infrastructure containers...');
            await simulateLoading('Creating network "portfolio_default" ', 200);
            await new Promise(r => setTimeout(r, 200));
            
            writeLine('\nStarting postgresql...');
            await simulateLoading('Creating container ', 300);
            writeLine(`c3d4e5f6g7h8   | PostgreSQL Database starting`);
            writeLine(`c3d4e5f6g7h8   | PostgreSQL init process complete; ready for start up.`);
            writeLine(`c3d4e5f6g7h8   | ${getCurrentTimestamp()} UTC [1] LOG:  database system is ready to accept connections`);
            
            await new Promise(r => setTimeout(r, 200));
            writeLine('\nStarting redis...');
            await simulateLoading('Creating container ', 250);
            writeLine(`d4e5f6g7h8i9   | ${getCurrentTimestamp(1)} * Ready to accept connections`);
            
            await new Promise(r => setTimeout(r, 200));
            writeLine('\nStarting kafka...');
            await simulateLoading('Creating container ', 300);
            writeLine(`e5f6g7h8i9j0   | [${getCurrentTimestamp(2)}] INFO Kafka Server started`);
            
            writeLine('\n\x1b[32mInfrastructure containers are ready\x1b[0m\n');
            runningApps.infrastructure = true;
            
            // Otomatik olarak Spring Boot uygulamasını başlat
            writeLine('docker run -d springapp');
            await commands.docker(['run', '-d', 'springapp']);


            writeLine('docker run -d goapp');
            await commands.docker(['run', '-d', 'goapp']);
            return;
        }

        if (args[0] === 'run' && args[1] === '-d') {
            if (!runningApps.infrastructure) {
                writeLine('\x1b[31mError: Infrastructure containers are not running. Please run:');
                writeLine('docker compose up\x1b[0m');
                return;
            }

            if (args[2] === 'springapp') {
                const startTime = getCurrentTimestamp();
                writeLine('Creating Spring Boot container...');
                await simulateLoading('Starting container ', 300);
                writeLine('\n[+] Container created: springapp');
                await new Promise(r => setTimeout(r, 300));
                
                writeLine('\n  .   ____          _            __ _ _');
                writeLine(' /\\\\ / ___\'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\');
                writeLine('( ( )\\___ | \'_ | \'_| | \'_ \\/ _` | \\ \\ \\ \\');
                writeLine(' \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )');
                writeLine('  \'  |____| .__|_| |_|_| |_\\__, | / / / /');
                writeLine(' =========|_|==============|___/=/_/_/_/');
                writeLine(' :: Spring Boot ::                (v3.4.1)');
                await new Promise(r => setTimeout(r, 300));

                writeLine(`${getCurrentTimestamp()}  INFO 1 --- [           main] c.s.UserServiceApplication               : Starting UserServiceApplication v1.0.0`);
                writeLine(`${getCurrentTimestamp()}  INFO 1 --- [           main] c.s.UserServiceApplication               : No active profile set, falling back to 1 default profile: "default"`);
                writeLine(`${getCurrentTimestamp()}  INFO 1 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories`);
                writeLine(`${getCurrentTimestamp()}  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)`);
                
                writeLine(`${getCurrentTimestamp()}  INFO 1 --- [           main] c.p.integration.GoServiceConfig          : Initializing Go service integration`);
                writeLine(`${getCurrentTimestamp()}  INFO 1 --- [           main] c.p.integration.GoServiceClient         : Registering Go service endpoints: http://localhost:8081/api/v1`);
                writeLine(`${getCurrentTimestamp()}  INFO 1 --- [           main] c.p.integration.EventBusConfig          : Setting up event bus for service communication`);
                
                writeLine(`${getCurrentTimestamp()}  INFO 1 --- [           main] c.s.UserServiceApplication             : Started UserServiceApplication in 3.666 seconds`);
                writeLine('\n\x1b[32mContainer springapp is now running and waiting for Go service\x1b[0m\n');
                runningApps.springBoot = true;
                return;
            }

            if (args[2] === 'goapp') {
                const startTime = getCurrentTimestamp();
                writeLine('Creating Go API container...');
                await simulateLoading('Starting container ', 800);
                writeLine('\n[+] Container created: goapp');
                await new Promise(r => setTimeout(r, 500));

                writeLine(`\n${getCurrentDate()} ${getCurrentTimestamp()} INFO Starting Go Microservice...`);
                writeLine(`${getCurrentTimestamp()} DEBUG Loading service configuration`);
                
                writeLine(`${getCurrentTimestamp()} INFO Establishing connection to Spring Boot service`);
                writeLine(`${getCurrentTimestamp()} DEBUG Registering with Spring Boot discovery service`);
                
                writeLine(`${getCurrentTimestamp()} INFO Starting HTTP server`);
                
                writeLine(`${getCurrentTimestamp()} INFO Establishing gRPC connection with Spring Boot`);
                writeLine(`${getCurrentTimestamp()} DEBUG gRPC server listening on :9090`);
                writeLine(`${getCurrentTimestamp()} INFO Connected to Spring Boot service successfully`);
                
                writeLine(`${getCurrentTimestamp()} INFO Starting metrics collector`);
                writeLine(`${getCurrentTimestamp()} INFO HTTP server running on :8081`);
                writeLine(`${getCurrentTimestamp()} INFO Health check endpoint: http://localhost:8081/health`);
                
                writeLine('\n\x1b[32mContainer goapp is now running and connected to Spring Boot service\x1b[0m');
                
                await new Promise(r => setTimeout(r, 500));
                writeLine(`\n${getCurrentTimestamp()} INFO [Spring Boot] Detected Go service startup`);
                writeLine(`${getCurrentTimestamp()} INFO [Spring Boot] Service communication established`);
                
                runningApps.goApp = true;
                term.write(terminalState.prompt);
                return;
            }
        }
        
        if (args[0] === 'ps') {
            writeLine('CONTAINER ID   IMAGE                         STATUS          PORTS');
            if (runningApps.springBoot) {
                writeLine('a1b2c3d4e5f6   springapp:latest            Up 2 minutes     0.0.0.0:8080->8080/tcp');
            }
            if (runningApps.goApp) {
                writeLine('b2c3d4e5f6g7   goapp:latest               Up 1 minute      0.0.0.0:8081->8081/tcp');
            }
            if (runningApps.infrastructure) {
                writeLine('c3d4e5f6g7h8   postgres:13                Up 10 minutes    0.0.0.0:5432->5432/tcp');
                writeLine('d4e5f6g7h8i9   redis:latest               Up 10 minutes    0.0.0.0:6379->6379/tcp');
                writeLine('e5f6g7h8i9j0   kafka:latest               Up 10 minutes    0.0.0.0:9092->9092/tcp');
            }
            return;
        }
    },

    'curl': async (args) => {
        const endpoint = args.join(' ');
        if (!runningApps.springBoot && !runningApps.goApp) {
            writeLine('\x1b[31mError: No running applications found. Start an app using:');
            writeLine('docker run -d springapp');
            writeLine('docker run -d goapp\x1b[0m');
            return;
        }

        await simulateLoading('Sending request ', 300);
        if (endpoint.includes('/api/profile')) {
            await simulateLoading('Fetching profile ', 200);
            term.write('HTTP/1.1 200 OK\r\n');
            term.write('Content-Type: application/json\r\n');
            term.write('\r\n');
            
            const response = {
                developer: {
                    name: "Backend Developer",
                    current_position: {
                        company: "Sahibinden.com",
                        role: "Software Developer",
                        period: "May 2022 - Present",
                        projects: [
                            "Backend services for enterprise business applications",
                            "Microservices transformation project",
                            "Highly scalable systems"
                        ]
                    },
                    previous_experience: [{
                        company: "Hitit",
                        role: "Software Developer (Part-time)",
                        period: "Feb 2022 - May 2022",
                        focus: ["Java Development", "Unit Testing"]
                    }],
                    education: {
                        university: "THK University",
                        degree: "Computer Engineering",
                        gpa: 3.33,
                        achievements: ["Department First", "Faculty Third"]
                    },
                    skills: {
                        languages: ["Java", "Kotlin", "Go"],
                        frameworks: ["Spring Boot", "JSF"],
                        databases: ["PostgreSQL", "MongoDB", "Redis"],
                        tools: ["Docker", "Kubernetes", "Kafka"]
                    }
                }
            };
            
            const colorized = colorizeJson(response);
            term.write(colorized + '\r\n');
        } else if (endpoint.includes('/api/experience')) {
            await simulateLoading('Fetching experience ', 200);
            term.write('HTTP/1.1 200 OK\r\n');
            term.write('Content-Type: application/json\r\n');
            term.write('\r\n');
            term.write(colorizeJson({
                current: {
                    company: "Sahibinden.com",
                    role: "Software Developer",
                    period: "May 2022 - Present",
                    responsibilities: [
                        "Backend service development for corporate applications",
                        "Microservice transformation",
                        "Production optimizations",
                        "Integration testing",
                        "High-scale system design"
                    ],
                    tech_stack: ["Java", "Spring Boot", "Kubernetes", "Kafka"]
                },
                previous: [{
                    company: "Hitit",
                    role: "Software Developer",
                    period: "Feb 2022 - May 2022",
                    type: "Part-time",
                    focus: ["Java Development", "Unit Testing", "Team Collaboration"]
                }]
            }) + '\r\n');
        } else if (endpoint.includes('api/health')) {
            term.write('HTTP/1.1 200 OK\r\n');
            term.write('Content-Type: application/json\r\n');
            term.write('\r\n');
            term.write(colorizeJson({
                status: "UP",
                components: {
                    db: { status: "UP" },
                    redis: { status: "UP" },
                    kafka: { status: "UP" }
                }
            }) + '\r\n');
        } else if (endpoint.includes('api/metrics')) {
            term.write('HTTP/1.1 200 OK\r\n');
            term.write('Content-Type: application/json\r\n');
            term.write('\r\n');
            term.write(colorizeJson({
                "jvm.memory.used": 385392944,
                "http.server.requests": 23424,
                "system.cpu.usage": 0.65,
                "hikaricp.connections.active": 12
            }) + '\r\n');
        } else if (endpoint.includes('localhost:8080/actuator/health')) {
            term.write('HTTP/1.1 200 OK\r\n');
            term.write('Content-Type: application/json\r\n');
            term.write('\r\n');
            term.write(colorizeJson({
                status: "UP",
                components: {
                    "userService": { status: "UP" },
                    "db": { status: "UP", details: { database: "PostgreSQL", version: "13.2" }},
                    "redis": { status: "UP", details: { version: "6.2.6" }},
                    "kafka": { status: "UP", details: { brokers: ["kafka-1", "kafka-2"] }}
                }
            }) + '\r\n');
        } else if (endpoint.includes('localhost:8080/api/projects')) {
            await simulateLoading('Fetching project data ', 200);
            term.write('HTTP/1.1 200 OK\r\n');
            term.write('Content-Type: application/json\r\n');
            term.write('\r\n');
            term.write(colorizeJson({
                projects: [{
                    name: "Social Platform Backend",
                    tech_stack: {
                        backend: ["Spring Boot", "Go"],
                        database: ["PostgreSQL", "Redis"],
                        messaging: ["Kafka"],
                        deployment: ["Docker", "Kubernetes", "ArgoCD"]
                    },
                    features: [
                        "Microservice architecture",
                        "WebSocket",
                        "Event-driven architecture",
                        "Cache optimization"
                    ]
                }]
            }) + '\r\n');
        } else if (endpoint.includes('localhost:8080/api/links')) {
            await simulateLoading('Fetching social links ', 200);
            term.write('HTTP/1.1 200 OK\r\n');
            term.write('Content-Type: application/json\r\n');
            term.write('\r\n');
            const response = {
                social_links: {
                    github: 'https://github.com/0uz',
                    linkedin: 'https://www.linkedin.com/in/oguzhanduymaz/',
                    portfolio: 'https://oguzhanduymaz.com'
                },
                git: {
                    total_commits: "1000+",
                    repos: 27,
                    languages: ["Java", "Go", "Python"]
                }
            };
            let colorized = colorizeJson(response);
            
            // Format links after colorizing
            colorized = colorized.replace(/"(https?:\/\/[^"]+)"/g, (match, url) => `"${formatLink(url)}"`);
            term.write(colorized + '\r\n');
        }
    },

    'psql': async (args) => {
        writeLine('psql (14.9)');
        writeLine('Type "help" for help.');
        writeLine('');
        writeLine('portfolio=# SELECT * FROM projects;');
        writeLine(' id |          name           |        tech_stack         |     description     ');
        writeLine('----+-------------------------+-------------------------+--------------------');
        writeLine('  1 | Social Platform Backend | Spring Boot, PostgreSQL | Microservice arch');
        writeLine('  2 | WebSocket Service      | Go, Redis              | Real-time messaging');
        writeLine('(2 rows)');
        writeLine('');
        writeLine('portfolio=# ');
    },

    'redis-cli': async (args) => {
        if (args[0] === 'ping') {
            writeLine('PONG');
        } else if (args[0] === 'monitor') {
            writeLine('OK');
            writeLine('1705312345.123456 [0 172.18.0.3:50302] "GET" "session:123"');
        } else if (args[0] === 'info') {
            writeLine('# Server');
            writeLine('redis_version:6.2.6');
            writeLine('redis_mode:standalone');
        }
    },

    'kafka-topics': async (args) => {
        if (args.includes('--list')) {
            writeLine('user-events');
            writeLine('notification-events');
            writeLine('payment-events');
        }
    },

    'git': async (args) => {
        if (args[0] === 'log') {
            writeLine('commit a1b2c3d4e5f6g7h8i9j0 (HEAD -> main)');
            writeLine('Author: Oğuzhan Duymaz <o.duymaz146@gmail.com>');
            writeLine('Date:   Wed Jan 15 12:00:00 2024 +0300');
            writeLine('');
            writeLine('    feat(user-service): implement websocket integration');
            writeLine('    - Add real-time messaging support');
            writeLine('    - Integrate Redis for presence tracking');
            writeLine('    - Add authentication middleware');
            writeLine('');
            writeLine('commit b2c3d4e5f6g7h8i9j0k1');
            writeLine('Author: Oğuzhan Duymaz <o.duymaz146@gmail.com>');
            writeLine('Date:   Tue Jan 14 15:30:00 2024 +0300');
            writeLine('');
            writeLine('    feat(auth): implement JWT authentication');
            writeLine('    - Add Spring Security configuration');
            writeLine('    - Implement user authentication flow');
            writeLine('    - Add token validation middleware');
        }
    },

    'clear': () => {
        term.clear();
        term.write('\x1b[H');
    },

    'htop': async () => {
        writeLine('\x1b[1m\x1b[38;5;82mSystem Resource Monitor\x1b[0m');
        writeLine('\x1b[38;5;244m(Press any key to exit)\x1b[0m\n');
        
        let monitoring = true;
        let frame = 0;
        
        const keyHandler = ({ domEvent }) => {
            monitoring = false;
            domEvent.preventDefault();
        };
        
        const disposable = term.onKey(keyHandler);
        
        while (monitoring && frame < 100) {
            const timestamp = new Date().toLocaleTimeString('tr-TR');
            const cpuUsage = Math.floor(Math.random() * 40 + 20);
            const memUsed = Math.floor(Math.random() * 300 + 400);
            const memTotal = 8192;
            const processes = Math.floor(Math.random() * 50 + 100);
            const loadAvg = (Math.random() * 2 + 0.5).toFixed(2);
            
            // Clear screen and redraw
            term.write('\x1b[2J\x1b[H');
            
            // Header
            writeLine(`\x1b[38;5;87m${timestamp}\x1b[0m  \x1b[1mSYSTEM MONITOR\x1b[0m  \x1b[38;5;244m[Press any key to exit]\x1b[0m`);
            writeLine('');
            
            // CPU Bar
            const cpuBar = '█'.repeat(Math.floor(cpuUsage / 5)) + '░'.repeat(20 - Math.floor(cpuUsage / 5));
            writeLine(`\x1b[38;5;82mCPU\x1b[0m    [\x1b[38;5;${cpuUsage > 80 ? 196 : 82}m${cpuBar}\x1b[0m] \x1b[1m${cpuUsage}%\x1b[0m  Load: ${loadAvg}`);
            
            // Memory Bar
            const memPercent = Math.floor((memUsed / memTotal) * 100);
            const memBar = '█'.repeat(Math.floor(memPercent / 5)) + '░'.repeat(20 - Math.floor(memPercent / 5));
            writeLine(`\x1b[38;5;214mMEM\x1b[0m    [\x1b[38;5;${memPercent > 80 ? 196 : 214}m${memBar}\x1b[0m] \x1b[1m${memPercent}%\x1b[0m  ${memUsed}MB / ${memTotal}MB`);
            
            // Processes
            writeLine(`\x1b[38;5;87mPROC\x1b[0m   \x1b[1m${processes}\x1b[0m running processes`);
            
            writeLine('');
            writeLine('\x1b[38;5;244mPID   USER      PRI  NI  VIRT   RES   SHR S  CPU% MEM%  TIME+   COMMAND\x1b[0m');
            
            // Process list
            const procs = [
                { pid: 1, user: 'root', cpu: cpuUsage, mem: 0.1, cmd: 'systemd' },
                { pid: 1423, user: 'backend', cpu: 12.5, mem: 2.3, cmd: 'java -jar app.jar' },
                { pid: 1847, user: 'backend', cpu: 8.2, mem: 1.8, cmd: 'go run main.go' },
                { pid: 2156, user: 'postgres', cpu: 4.1, mem: 3.2, cmd: 'postgres: wal writer' },
                { pid: 2234, user: 'redis', cpu: 2.3, mem: 0.8, cmd: 'redis-server' },
                { pid: 2456, user: 'backend', cpu: 6.7, mem: 1.5, cmd: 'node metrics.js' },
                { pid: 2678, user: 'root', cpu: 1.2, mem: 0.4, cmd: 'kworker/u:2' },
            ];
            
            procs.forEach(p => {
                const cpuStr = p.cpu.toFixed(1).padStart(5);
                const memStr = p.mem.toFixed(1).padStart(4);
                writeLine(`${p.pid.toString().padStart(5)}  ${p.user.padEnd(8)}  20   0  234M  ${(p.mem * 80).toFixed(0)}M  12M S ${cpuStr} ${memStr}  0:02.11 ${p.cmd}`);
            });
            
            await new Promise(r => setTimeout(r, 1000));
            frame++;
        }
        
        disposable.dispose();
        writeLine('\n\x1b[38;5;82mMonitor closed.\x1b[0m');
    },

    help: () => {
        writeLine('\x1b[1m\x1b[38;5;81m╔══════════════════════════════════════════════════════════════╗\x1b[0m');
        writeLine('\x1b[1m\x1b[38;5;81m║           Backend Developer Terminal v2.0.0                  ║\x1b[0m');
        writeLine('\x1b[1m\x1b[38;5;81m╚══════════════════════════════════════════════════════════════╝\x1b[0m\n');
        
        writeLine('\x1b[1m\x1b[38;5;214m🚀 Application Control:\x1b[0m');
        writeLine('    docker compose up       Start all infrastructure containers');
        writeLine('    docker run -d springapp Start Spring Boot application');
        writeLine('    docker run -d goapp     Start Go WebSocket server');
        writeLine('    docker ps               List running containers');
        writeLine('');
        
        writeLine('\x1b[1m\x1b[38;5;214m📡 API Endpoints:\x1b[0m');
        writeLine('    curl localhost:8080/api/profile    Show CV and profile');
        writeLine('    curl localhost:8080/api/experience Show work experience');
        writeLine('    curl localhost:8080/api/projects   Show project details');
        writeLine('    curl localhost:8080/api/links      Show social links');
        writeLine('    curl localhost:8080/api/health     System health check');
        writeLine('');
        
        writeLine('\x1b[1m\x1b[38;5;214m🛠️ Database & Infrastructure Tools:\x1b[0m');
        writeLine('    psql -h localhost         PostgreSQL client');
        writeLine('    redis-cli                 Redis interactive client');
        writeLine('    kafka-topics --list       List Kafka topics');
        writeLine('    git log                   Show commit history');
        writeLine('');
        
        writeLine('\x1b[1m\x1b[38;5;82m⚡ System Monitor:\x1b[0m');
        writeLine('    htop                      Real-time system resource monitor');
        writeLine('');
        
        writeLine('\x1b[1m\x1b[38;5;87m💡 Tips:\x1b[0m');
        writeLine('    • Press Tab for command auto-completion');
        writeLine('    • Use arrow keys for command history');
        writeLine('    • Click "Simple Mode" button for HR-friendly view');
        writeLine('    • Try "docker compose up" to start the full stack!');
        writeLine('    • Try "htop" for live system monitoring');
        writeLine('');
        
        writeLine('\x1b[38;5;214m🎯 Quick Start: Type "docker compose up" to begin the demo\x1b[0m');
        return Promise.resolve();
    }
};

// Tab completion handler'ı düzeltelim
function handleTabCompletion(line) {
    if (!line) return line;
    
    const args = line.split(' ');
    const cmd = args[0];
    const currentArg = args.length > 1 ? args.slice(1).join(' ') : '';

    if (args.length === 1) {
        const matches = Object.keys(commands).filter(c => c.startsWith(cmd.toLowerCase()));
        if (matches.length === 1) {
            return matches[0];
        } else if (matches.length > 0) {
            // Ortak prefix'i bul
            const commonPrefix = findCommonPrefix(matches);
            if (commonPrefix.length > cmd.length) {
                return commonPrefix;
            }
            // Eşleşenleri göster
            writeLine('');
            matches.forEach(match => term.write(match + '  '));
            writeLine('');
            term.write(terminalState.prompt + line);
            return line;
        }
    } else if (commandCompletions[cmd]) {
        const matches = commandCompletions[cmd].filter(c => c.startsWith(currentArg));
        if (matches.length === 1) {
            return cmd + ' ' + matches[0];
        } else if (matches.length > 0) {
            // Ortak prefix'i bul
            const commonPrefix = findCommonPrefix(matches);
            if (commonPrefix.length > currentArg.length) {
                return cmd + ' ' + commonPrefix;
            }
            // Eşleşenleri göster
            writeLine('');
            matches.forEach(match => term.write(match + '  '));
            writeLine('');
            term.write(terminalState.prompt + line);
            return line;
        }
    }
    return line;
}

// Ortak prefix bulan yardımcı fonksiyon
function findCommonPrefix(strings) {
    if (!strings.length) return '';
    if (strings.length === 1) return strings[0];
    
    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
        while (strings[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (!prefix) return '';
        }
    }
    return prefix;
}

function updateMobileCommands() {
    const mobileCommands = document.getElementById('mobile-commands');
    if (!mobileCommands) return;

    mobileCommands.innerHTML = '';

    const buttons = [
        { text: 'clear', cmd: 'clear' },
        { text: 'profile', cmd: 'curl localhost:8080/api/profile' },
        { text: 'experience', cmd: 'curl localhost:8080/api/experience' },
        { text: 'projects', cmd: 'curl localhost:8080/api/projects' },
        { text: 'links', cmd: 'curl localhost:8080/api/links' },
    ];

    buttons.forEach(({ text, cmd }) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = () => executeCommand(cmd);
        mobileCommands.appendChild(button);
    });
}

function executeCommand(command) {
    term.write('\r\n');
    const [cmd, ...args] = command.trim().toLowerCase().split(' ');
    
    if (commands.hasOwnProperty(cmd)) {
        try {
            Promise.resolve(commands[cmd](args)).finally(() => {
                term.write('\r\n' + terminalState.prompt);
                updateMobileCommands();
            });
        } catch (error) {
            writeLine('Error executing command: ' + error);
            term.write(terminalState.prompt);
            updateMobileCommands();
        }
    } else {
        writeLine(`Command not found: ${cmd}`);
        writeLine('Type "help" for available commands');
        term.write(terminalState.prompt);
        updateMobileCommands();
    }
    
    terminalState.currentLine = '';
    terminalState.cursorPosition = 0;
}
