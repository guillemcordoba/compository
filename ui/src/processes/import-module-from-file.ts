export async function importModuleFromFile(file: File) {
  const text = await file.text();
  // prettier-ignore
  const module = await import(`data:application/javascript,
   ${text}
 `);

  return module;
}
