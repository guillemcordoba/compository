export async function importModuleFromFile(file) {
    const text = await file.text();
    // prettier-ignore
    const module = await import(`data:application/javascript,
   ${text}
 `);
    return module;
}
//# sourceMappingURL=import-module-from-file.js.map