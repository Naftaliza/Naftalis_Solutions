import fs from 'fs';

const PATH_REGEX = /path=["']([^"']+)["']/;
// Just the component name right after `element={<` — deliberately not trying
// to match the whole element tag, since it's usually self-closing (e.g.
// `<SolutionsPage />`) and contains a `>` before Route's own closing `>`.
const ELEMENT_REGEX = /element=\{<(\w+)/;

/**
 * Extracts { componentName -> routePath } from the <Route> lines in App.jsx.
 * Assumes each <Route ... /> declaration lives on its own line, which holds
 * for this project's routing style.
 */
export function extractRoutes(appJsxPath) {
  if (!fs.existsSync(appJsxPath)) return new Map();

  const content = fs.readFileSync(appJsxPath, 'utf8');
  const routes = new Map();
  const routeLines = content.split('\n').filter(line => line.includes('<Route'));

  for (const line of routeLines) {
    const pathMatch = line.match(PATH_REGEX);
    const elementMatch = line.match(ELEMENT_REGEX);

    if (elementMatch && pathMatch) {
      const componentName = elementMatch[1];
      const routePath = pathMatch[1].startsWith('/') ? pathMatch[1] : `/${pathMatch[1]}`;
      // Keep the first route seen per component (e.g. "/" before its "/solutions"
      // alias) so callers get the canonical URL, not the last-declared duplicate.
      if (!routes.has(componentName)) {
        routes.set(componentName, routePath);
      }
    }
  }

  return routes;
}
