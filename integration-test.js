// 集成测试：验证上下文感知功能与Electron应用的集成
const ContextAnalyzer = require('./electron/context-analyzer');

console.log('🚀 开始集成测试...\n');

// 创建分析器实例
const analyzer = new ContextAnalyzer();

// 模拟真实的终端窗口场景
const testScenarios = [
    {
        name: 'Git项目开发场景',
        window: {
            title: 'Terminal - user@host:~/my-react-app$ git status',
            owner: { name: 'iTerm2' }
        },
        expected: {
            commandType: 'git',
            currentCommand: 'git status',
            workingDirectory: '~/my-react-app'
        }
    },
    {
        name: 'Node.js项目开发场景',
        window: {
            title: 'Terminal - user@host:~/node-api$ npm run dev',
            owner: { name: 'Terminal' }
        },
        expected: {
            commandType: 'npm',
            currentCommand: 'npm run dev',
            workingDirectory: '~/node-api'
        }
    },
    {
        name: 'Python数据分析场景',
        window: {
            title: 'Terminal - user@host:~/data-analysis$ python analyze.py',
            owner: { name: 'iTerm2' }
        },
        expected: {
            commandType: 'python',
            currentCommand: 'python analyze.py',
            workingDirectory: '~/data-analysis'
        }
    },
    {
        name: 'Docker容器管理场景',
        window: {
            title: 'Terminal - user@host:~/docker-projects$ docker ps -a',
            owner: { name: 'Terminal' }
        },
        expected: {
            commandType: 'docker',
            currentCommand: 'docker ps -a',
            workingDirectory: '~/docker-projects'
        }
    }
];

async function runIntegrationTest() {
    console.log('🧪 运行集成测试场景...\n');
    
    let passed = 0;
    let total = testScenarios.length;
    
    for (const scenario of testScenarios) {
        console.log(`📋 测试场景: ${scenario.name}`);
        console.log(`  窗口标题: ${scenario.window.title}`);
        
        try {
            const result = await analyzer.analyzeTerminalContext(scenario.window);
            
            // 验证结果
            const isCommandTypeMatch = result.commandType === scenario.expected.commandType;
            const isCurrentCommandMatch = result.currentCommand === scenario.expected.currentCommand;
            const isWorkingDirectoryMatch = result.workingDirectory === scenario.expected.workingDirectory;
            
            if (isCommandTypeMatch && isCurrentCommandMatch && isWorkingDirectoryMatch) {
                console.log('   ✅ 测试通过');
                passed++;
            } else {
                console.log('   ❌ 测试失败');
                if (!isCommandTypeMatch) console.log(`     命令类型不匹配: 期望 ${scenario.expected.commandType}, 实际 ${result.commandType}`);
                if (!isCurrentCommandMatch) console.log(`     当前命令不匹配: 期望 ${scenario.expected.currentCommand}, 实际 ${result.currentCommand}`);
                if (!isWorkingDirectoryMatch) console.log(`     工作目录不匹配: 期望 ${scenario.expected.workingDirectory}, 实际 ${result.workingDirectory}`);
            }
            
        } catch (error) {
            console.log('   ❌ 测试异常:', error.message);
        }
        
        console.log('');
    }
    
    console.log(`📊 测试结果: ${passed}/${total} 通过`);
    console.log(`🎯 成功率: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (passed === total) {
        console.log('\n🎉 所有集成测试通过！上下文感知功能已成功实现。');
    } else {
        console.log('\n⚠️  部分测试未通过，需要进一步调试。');
    }
}

runIntegrationTest();