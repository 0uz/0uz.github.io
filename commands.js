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

    // Fun & Interactive Commands
    'typing': async () => {
        const code = `
@SpringBootApplication
public class AwesomeDeveloper {
    
    @Autowired
    private CoffeeService coffeeService;
    
    @PostConstruct
    public void init() {
        System.out.println("Ready to ship production code!");
    }
    
    public void solveProblems() {
        while (bugsExist()) {
            drinkCoffee();
            writeCleanCode();
            deployToProd();
        }
    }
}`;
        writeLine('\x1b[1m\x1b[38;5;82mWriting production code...\x1b[0m\n');
        for (let i = 0; i < code.length; i++) {
            term.write('\x1b[38;5;252m' + code[i] + '\x1b[0m');
            await new Promise(r => setTimeout(r, 30));
        }
        writeLine('\n\n\x1b[1m\x1b[38;5;82m✓ Code compiled successfully!\x1b[0m');
        writeLine('\x1b[38;5;214mReady to deploy to production\x1b[0m');
    },

    'benchmark': async () => {
        writeLine('\x1b[1m\x1b[38;5;81mRunning performance benchmark...\x1b[0m\n');
        const tests = [
            { name: 'REST API Latency', metric: '45ms', score: 95 },
            { name: 'Database Queries/sec', metric: '12,500', score: 92 },
            { name: 'Cache Hit Ratio', metric: '97.8%', score: 98 },
            { name: 'Concurrent Users', metric: '50,000', score: 94 },
            { name: 'Memory Usage', metric: '385MB', score: 89 }
        ];
        
        for (const test of tests) {
            await simulateLoading(`Testing ${test.name} `, 600);
            const bar = '█'.repeat(Math.floor(test.score / 5)) + '░'.repeat(20 - Math.floor(test.score / 5));
            writeLine(`\x1b[38;5;87m${test.name.padEnd(25)}\x1b[0m [\x1b[38;5;82m${bar}\x1b[0m] \x1b[1m${test.metric}\x1b[0m`);
        }
        
        writeLine('\n\x1b[1m\x1b[38;5;82m✓ All benchmarks passed!\x1b[0m');
        writeLine('\x1b[38;5;214mSystem ready for high-scale production load\x1b[0m');
    },

    'monitor': async () => {
        writeLine('\x1b[1m\x1b[38;5;81mReal-time System Monitor\x1b[0m');
        writeLine('Press Ctrl+C to exit\n');
        
        const metrics = [
            { label: 'CPU Usage', color: 82, getValue: () => (Math.random() * 30 + 20).toFixed(1) },
            { label: 'Memory', color: 214, getValue: () => (Math.random() * 200 + 300).toFixed(0) },
            { label: 'Active Connections', color: 87, getValue: () => Math.floor(Math.random() * 500 + 1000) },
            { label: 'Requests/sec', color: 213, getValue: () => Math.floor(Math.random() * 200 + 800) }
        ];
        
        let iterations = 0;
        const interval = setInterval(() => {
            if (iterations >= 10) {
                clearInterval(interval);
                writeLine('\n\x1b[38;5;82mMonitoring session ended\x1b[0m');
                term.write(terminalState.prompt);
                return;
            }
            
            const timestamp = getCurrentTimestamp();
            let line = `\x1b[38;5;244m${timestamp}\x1b[0m  `;
            
            metrics.forEach(m => {
                const value = m.getValue();
                const unit = m.label === 'Memory' ? 'MB' : (m.label === 'CPU Usage' ? '%' : '');
                line += `\x1b[38;5;${m.color}m${m.label}: ${value}${unit}\x1b[0m  `;
            });
            
            term.write(line + '\r\n');
            iterations++;
        }, 800);
        
        return new Promise(resolve => setTimeout(() => resolve(), 9000));
    },

    'matrix': async () => {
        writeLine('\x1b[1m\x1b[38;5;82mEntering the Matrix...\x1b[0m');
        writeLine('\x1b[38;5;244m(Press any key to exit)\x1b[0m\n');
        
        const chars = '0123456789ABCDEF';
        const lines = 15;
        const cols = 40;
        let matrixRunning = true;
        
        // Key handler to stop matrix
        const keyHandler = ({ domEvent }) => {
            matrixRunning = false;
            domEvent.preventDefault();
        };
        
        // Attach temporary key handler
        const disposable = term.onKey(keyHandler);
        
        let frame = 0;
        while (matrixRunning && frame < 200) {
            let output = '';
            for (let i = 0; i < lines; i++) {
                for (let j = 0; j < cols; j++) {
                    if (Math.random() > 0.7) {
                        output += `\x1b[38;5;${Math.floor(Math.random() * 6 + 22)}m${chars[Math.floor(Math.random() * chars.length)]}\x1b[0m`;
                    } else {
                        output += ' ';
                    }
                }
                output += '\r\n';
            }
            term.write(output);
            
            // Check every 10 frames if we should continue
            frame++;
            await new Promise(r => setTimeout(r, 80));
        }
        
        // Clean up
        disposable.dispose();
        
        term.write('\r\n');
        writeLine('\x1b[1m\x1b[38;5;82mMatrix exited. Welcome back to reality.\x1b[0m');
    },

    'celebrate': async () => {
        writeLine('\x1b[1m\x1b[38;5;214m🎉 Celebration mode activated! 🎉\x1b[0m');
        
        // Trigger confetti
        if (typeof confetti !== 'undefined') {
            const duration = 3000;
            const end = Date.now() + duration;
            
            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#00d4ff', '#ff6b6b', '#ffd93d', '#51cf66']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#00d4ff', '#ff6b6b', '#ffd93d', '#51cf66']
                });
                
                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
        
        writeLine('\x1b[38;5;82m✓ You just witnessed my backend skills!\x1b[0m');
        writeLine('\x1b[38;5;87mReady to bring this energy to your team!\x1b[0m');
    },

    'coffee': async () => {
        const frames = [
            '     )  (',
            '    (   ) )',
            '     ) ( (',
            '   _______)_',
            ' .`---------|',
            ' (  /       |',
            '  `-`-------`'
        ];
        
        writeLine('\x1b[38;5;214mBrewing coffee for optimal coding performance...\x1b[0m\n');
        
        for (let i = 0; i < 3; i++) {
            frames.forEach((frame, idx) => {
                setTimeout(() => {
                    term.write('\r\x1b[K' + '\x1b[38;5;94m' + frame + '\x1b[0m');
                }, idx * 200);
            });
            await new Promise(r => setTimeout(r, frames.length * 200 + 300));
        }
        
        writeLine('\n\n\x1b[1m\x1b[38;5;82m☕ Coffee ready! Productivity increased by 9000%\x1b[0m');
    },

    'hack': async () => {
        writeLine('\x1b[1m\x1b[38;5;196mWARNING: Hollywood hacker mode engaged!\x1b[0m\n');
        
        const hackLines = [
            'Bypassing mainframe firewall...',
            'Decrypting AES-256 encryption...',
            'Establishing backdoor connection...',
            'Downloading confidential data...',
            'Uploading virus to enemy server...',
            'Overriding security protocols...',
            'Access granted to Pentagon servers...',
            'I\'m in! 🕶️'
        ];
        
        for (const line of hackLines) {
            await simulateLoading(line + ' ', 400);
            writeLine(`\x1b[38;5;82m[OK]\x1b[0m ${line}`);
        }
        
        writeLine('\n\x1b[1m\x1b[38;5;82mJust kidding! Real hacking takes much more skill and time 😄\x1b[0m');
        writeLine('\x1b[38;5;87mBut I can build secure systems that prevent this!\x1b[0m');
    },

    'ascii': async () => {
        writeLine('\x1b[1m\x1b[38;5;81mGitHub Contribution Graph (Last Year)\x1b[0m\n');
        
        const days = ['Mon', 'Wed', 'Fri'];
        const levels = ['░', '▒', '▓', '█'];
        
        writeLine('        Jan   Feb   Mar   Apr   May   Jun   Jul   Aug   Sep   Oct   Nov   Dec');
        
        for (let day = 0; day < 7; day++) {
            let line = (day % 2 === 0 ? days[day/2] || '   ' : '   ') + '  ';
            for (let week = 0; week < 52; week++) {
                const activity = Math.random();
                let char;
                if (activity < 0.5) char = levels[0];
                else if (activity < 0.7) char = '\x1b[38;5;28m' + levels[1] + '\x1b[0m';
                else if (activity < 0.85) char = '\x1b[38;5;34m' + levels[2] + '\x1b[0m';
                else char = '\x1b[38;5;82m' + levels[3] + '\x1b[0m';
                line += char;
            }
            writeLine(line);
        }
        
        writeLine('\n\x1b[38;5;244mLess \x1b[38;5;28m▒\x1b[38;5;34m▓\x1b[38;5;82m█\x1b[38;5;244m More\x1b[0m');
        writeLine('\x1b[1m\x1b[38;5;82m1000+ commits in the last year!\x1b[0m');
    },

    'whoami': () => {
        writeLine('\x1b[1m\x1b[38;5;87mOğuzhan Duymaz\x1b[0m - Backend Developer Extraordinaire');
        writeLine('\x1b[38;5;252m----------------------------------------\x1b[0m');
        writeLine('\x1b[38;5;82mSpecialties:\x1b[0m');
        writeLine('  • High-scale distributed systems');
        writeLine('  • Microservices architecture');
        writeLine('  • Performance optimization');
        writeLine('  • Coffee consumption');
        writeLine('\x1b[38;5;82mMission:\x1b[0m Building robust backends that scale');
        writeLine('\x1b[38;5;214mFun fact: This terminal is running entirely in your browser!\x1b[0m');
    },

    'sudo': async (args) => {
        if (args.join(' ') === 'make me a coffee') {
            writeLine('\x1b[38;5;196m[sudo]\x1b[0m password for root: \x1b[38;5;252m********\x1b[0m');
            await new Promise(r => setTimeout(r, 800));
            writeLine('\x1b[38;5;82mAccess granted. Elevating privileges...\x1b[0m\n');
            await new Promise(r => setTimeout(r, 500));
            
            const coffeeArt = [
                '                    (    ',
                '                      )  ',
                '              (       )  ',
                '               )     (   ',
                '             (       )   ',
                '          ___(_______)___',
                '          |  COFFEE     |',
                '          |   FOR ROOT  |',
                '          |_____________|',
                '           (   )   (   ) ',
                '            |_|     |_|  '
            ];
            
            coffeeArt.forEach(line => {
                writeLine('\x1b[38;5;94m' + line + '\x1b[0m');
            });
            
            writeLine('\n\x1b[1m\x1b[38;5;82m☕ Premium coffee served with root privileges!\x1b[0m');
            writeLine('\x1b[38;5;214mOnly the best for admins 😎\x1b[0m');
        } else {
            writeLine('\x1b[38;5;196msudo: unknown command\x1b[0m');
            writeLine('\x1b[38;5;252mTry: sudo make me a coffee\x1b[0m');
        }
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
        
        writeLine('\x1b[1m\x1b[38;5;82m✨ Special Commands (Try these!):\x1b[0m');
        writeLine('    benchmark       Run performance benchmarks');
        writeLine('    monitor         Real-time system monitoring');
        writeLine('    typing          Watch me write code in real-time');
        writeLine('    matrix          Enter the Matrix (visual effect)');
        writeLine('    celebrate       Celebration mode! 🎉');
        writeLine('    coffee          Brew some virtual coffee ☕');
        writeLine('    hack            Hollywood hacker simulation');
        writeLine('    ascii           GitHub contribution graph');
        writeLine('    whoami          About this developer');
        writeLine('');
        
        writeLine('\x1b[1m\x1b[38;5;87m💡 Tips:\x1b[0m');
        writeLine('    • Press Tab for command auto-completion');
        writeLine('    • Use arrow keys for command history');
        writeLine('    • Click "Simple Mode" button for HR-friendly view');
        writeLine('    • Try "docker compose up" to start the full stack!');
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
