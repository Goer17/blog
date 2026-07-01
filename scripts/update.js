import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml'

// Fix YAML values that contain colons (e.g. "title: foo: bar") by quoting them
function fixYamlColons(yamlStr) {
  return yamlStr.replace(/^(\w[\w-]*):\s*(.*)/gm, (match, key, value) => {
    if (value.includes(':') && !value.startsWith('"') && !value.startsWith("'") && !value.startsWith('[')) {
      return `${key}: "${value}"`;
    }
    return match;
  });
}

function collectMdFiles(dirPath, relativeDir = '') {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const results = [];

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            results.push(...collectMdFiles(fullPath, path.join(relativeDir, entry.name)));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            const fileName = entry.name.slice(0, -3);
            const filePath = relativeDir ? relativeDir.split(path.sep).join('|') + '|' + fileName : fileName;
            const category = relativeDir ? relativeDir.split(path.sep) : [];
            results.push({ file: filePath, _category: category });
        }
    }

    return results;
}

(async () => {
    try {
        const postsDir = './public/posts';
        const outputPath = './public/posts.json';

        const fileEntries = collectMdFiles(postsDir);
        const results = [];

        for (const entry of fileEntries) {
            const mdPath = path.join(postsDir, entry.file.replace(/\|/g, path.sep) + '.md');
            const postContent = fs.readFileSync(mdPath, 'utf-8');
            const postData = postContent.match(/^---\n([\s\S]+?)\n---/);
            if (!postData) {
                console.warn(`[WARNING] can't find meta info in the file ${entry.file}.md.`);
                continue;
            }
            try {
                const info = yaml.load(fixYamlColons(postData[1]));
                // auto-detect category from directory structure, override frontmatter
                results.push({ file: entry.file, ...info, category: entry._category });
            }
            catch (e) {
                console.error(`[ERROR] can't parse meta info in the file ${entry.file}.md: ${postData}`);
            }
        }

        results.sort((a, b) => {
            const aZIndex = a['z-index'] || 0;
            const bZIndex = b['z-index'] || 0;
            if (aZIndex !== bZIndex) {
                return bZIndex - aZIndex;
            }

            const aTime = a.time ? new Date(a.time).getTime() : 0;
            const bTime = b.time ? new Date(b.time).getTime() : 0;
            return bTime - aTime;
        });

        fs.writeFileSync(
            outputPath,
            JSON.stringify(results, null, 2),
            'utf-8'
        );
        console.log(`Successfully updated ${outputPath}, total ${results.length} posts`);
    } catch (e) {
        console.error('Processing failed:', e.message);
        process.exit(1);
    }
})();

