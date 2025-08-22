// 测试上下文分析器功能
const ContextAnalyzer = require('./electron/context-analyzer');

// 创建分析器实例
const analyzer = new ContextAnalyzer();

// 测试不同的终端上下文
const testTitles = [
    'Terminal - git status: user@host:~/project$ git status',
    'Terminal - npm install: user@host:~/project$ npm install react',
    'Terminal - docker ps: user@host:~/project$ docker ps',
    'Terminal - python script: user@host:~/project$ python main.py',
    'Terminal - yarn add: user@host:~/project$ yarn add lodash',
    'Terminal - node script: user@host:~/project$ node server.js',
    'Terminal - system command: user@host:~/project$ ls -la',
    'Terminal - network: user@host:~/project$ curl https://api.example.com'
];

console.log('🧪 测试上下文分析器功能...\n');

testTitles.forEach((title, index) => {
    console.log(`📝 测试 ${index + 1}: ${title}`);
    
    // 测试完整的上下文分析
    const currentCommand = analyzer.extractCurrentCommand(title);
    const commandType = analyzer.detectCommandType(title);
    
    console.log(`  分析结果:`);
    console.log(`  - 命令类型: ${commandType}`);
    console.log(`  - 当前命令: ${currentCommand}`);
    
    // 测试工作目录提取
    analyzer.extractWorkingDirectory(title).then(workingDir => {
        console.log(`  - 工作目录: ${workingDir}`);
        console.log('');
    });
});

// 测试模拟的窗口对象分析
setTimeout(async () => {
    console.log('\n🧪 测试完整的窗口上下文分析...');
    
    const mockWindow = {
        title: 'Terminal - user@host:~/my-project$ git status',
        owner: { name: 'Terminal' }
    };
    
    const result = await analyzer.analyzeTerminalContext(mockWindow);
    console.log('📝 完整窗口分析结果:');
    console.log(`  - 应用名称: ${result.appName}`);
    console.log(`  - 窗口标题: ${result.windowTitle}`);
    console.log(`  - 当前命令: ${result.currentCommand}`);
    console.log(`  - 工作目录: ${result.workingDirectory}`);
    console.log(`  - 命令类型: ${result.commandType}`);
    console.log(`  - 项目类型: ${result.projectType}`);
    console.log(`  - 是否在项目中: ${result.isInProject}`);
    console.log(`  - 置信度: ${result.confidence}`);
    
    console.log('\n✅ 所有测试完成！');
}, 100);