import { IgnitorModule } from "@/core/IgnitorModule";
import { AppError } from "@/core/errors/AppError";
import { HTTPStatusCode } from "@/types/HTTPStatusCode";

export function sortModulesByDependencies(
  modules: IgnitorModule[],
): IgnitorModule[] {
  const sorted: IgnitorModule[] = [];
  const visited: Set<string> = new Set();
  const temp: Set<string> = new Set();

  const visit = (module: IgnitorModule) => {
    if (temp.has(module.name)) {
      throw new AppError({
        statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
        message: `Circular dependency detected: ${module.name}`,
        code: "CIRCULAR_DEPENDENCY",
      });
    }
    if (!visited.has(module.name)) {
      temp.add(module.name);
      if (module.dependencies) {
        module.dependencies.forEach((depName) => {
          const dep = modules.find((m) => m.name === depName);
          if (!dep) {
            throw new AppError({
              statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
              message: `Dependency ${depName} not found for module ${module.name}`,
              code: "MISSING_DEPENDENCY",
            });
          }
          visit(dep);
        });
      }
      temp.delete(module.name);
      visited.add(module.name);
      sorted.push(module);
    }
  };

  modules.forEach(visit);
  return sorted;
}
