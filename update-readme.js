import fs from 'fs';

const dep = 'monaco-editor';
const readmePath = 'README.md';

function updateReadme() {
    const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const version = (pkg.dependencies && pkg.dependencies[dep]) || (pkg.devDependencies && pkg.devDependencies[dep]);

    if (!version) {
        console.error('monaco-editor not found in dependencies');
        process.exit(1);
    }

    let readme = fs.readFileSync(readmePath, 'utf8');
    const regex = /<!-- monaco-editor-version -->(.*?)<!-- \/monaco-editor-version -->/s;
    readme = readme.replace(
        regex,
        `<!-- monaco-editor-version -->\`${ dep }@${ version }\`<!-- /monaco-editor-version -->`
    );
    fs.writeFileSync(readmePath, readme);
    console.log(`Updated README.md with monaco-editor@${ version }`);
}

updateReadme();
