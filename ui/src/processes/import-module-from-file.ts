export async function importModuleFromFile(file: File) {
  const text = await file.text();
  const module = await (`data:application/javascript,
    ${text}
  `);

  return module;
}
