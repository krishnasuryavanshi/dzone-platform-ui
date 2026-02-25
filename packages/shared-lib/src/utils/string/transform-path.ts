export function transformPath(template: string, values: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    if (key in values) {
      return values[key];
    }
    return `{${key}}`;
  });
}
