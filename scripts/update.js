import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml'

async function parseMetadata(dirPath) {
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.md'));
    const results = []

    for (const file of files) {
        const postContent = fs.readFileSync(path.join(dirPath, file), 'utf-8');
        const postData = postContent.match(/^---\n([\s\S]+?)\n---/);
        if (!postData) {
            console.warn(`[WARNING] can't find meta info in the file ${file}.`);
            continue;
        }
        try {
            const info = yaml.load(postData[1]);
            results.push({file, ...info})
        }
        catch (e) {
            console.error(`[ERROR] can't parse meta info in the file ${file}: ${postData}`);
        }
    }

    return results
}

(async () => {
    try {
        const postsDir = './public/_posts';
        const outputPath = './public/posts.json';
        
        const results = await parseMetadata(postsDir);
        
        fs.writeFileSync(
            outputPath,
            JSON.stringify(results, null, 2),
            'utf-8'
        );    
        console.log(`✅ Successfully updated ${outputPath}, total ${results.length} posts`);
    } catch (e) {
        console.error('❌ Processing failed:', e.message);
        process.exit(1);
    }
})();

