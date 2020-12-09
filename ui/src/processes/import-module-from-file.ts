export async function importModuleFromFile(file: File) {
  const text = await file.text();
  // @ts-ignore
  /* eslint-disable */
  const module = await (`data:application/javascript,
   ${text}
 `);
  /* eslint-enable */

  return module;
}
