export const preloadTemplates = async function () {
  const templatePaths = [
    // Add paths to "module/XXX/templates"
    //`/modules/${MODULE_ID}/templates/XXX.html`,
  ];

  return loadTemplates(templatePaths);
};
