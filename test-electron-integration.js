// 测试上下文分析器在应用中的集成
const ContextAnalyzer = require('./electron/context-analyzer');

console.log('🧪 测试Electron应用中的上下文感知集成...\n');

// 创建分析器实例
const analyzer = new ContextAnalyzer();

// 模拟Electron应用中的窗口对象
const mockWindows = [
    {
        title: 'Terminal - user@host:~/my-react-app$ git status',
        owner: { name: 'iTerm2' }
    },
    {
        title: 'Terminal - user@host:~/node-api$ npm run dev',
        owner: { name: 'Terminal' }
    }
];

async function testElectronIntegration() {
    console.log('📋 模拟Electron应用中的窗口上下文分析...\n');
    
    for (let i = 0; i < mockWindows.length; i++) {
        const window = mockWindows[i];
        console.log(`窗口 ${i + 1}: ${window.title}`);
        
        try {
            const context = await analyzer.analyzeTerminalContext(window);
            
            console.log('  分析结果:');
            console.log(`  - 应用: ${context.appName}`);
            console.log(`  - 命令: ${context.currentCommand}`);
            console.log(`  - 类型: ${context.commandType}`);
            console.log(`  - 目录: ${context.workingDirectory}`);
            console.log(`  - 置信度: ${context.confidence}`);
            console.log('');
            
            // 测试命令推荐功能
            const mockCommands = [
                { name: 'Git Status', command: 'git status', usage_count: 10, is_favorite: true },
                { name: 'Git Add All', command: 'git add .', usage_count: 5, is_favorite: false },
                { name: 'NPM Start', command: 'npm start', usage_count: 8, is_favorite: true },
                { name: 'NPM Install', command: 'npm install', usage_count: 12, is_favorite: false }
            ];
            
            const recommendations = await analyzer.recommendCommands(context, mockCommands);
            console.log('  💡 推荐命令:');
            recommendations.forEach((cmd, index) => {
                console.log(`    ${index + 1}. ${cmd.name} - ${cmd.command}`);
            });
            
        } catch (error) {
            console.log('  ❌ 分析失败:', error.message);
        }
        
        console.log('---');
    }
    
    console.log('✅ Electron集成测试完成！');
}

testElectronIntegration();