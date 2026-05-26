
type PrismaModel<T> = {
  findUnique: (args: { where: Partial<T>; select?: Partial<Record<keyof T, boolean>> }) => Promise<T | null>;
};

export const cleanString = (input: string, slugify = false): string => {
  const trimmed = input.trim().replace(/\s+/g, slugify ? "-" : " ");
  return slugify ? trimmed.toLowerCase() : trimmed;
};


// ("  Hello World  ", true) => "hello-world"
export const generateSlug = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")                    // handle accented chars: é → e
    .replace(/[\u0300-\u036f]/g, "")     // strip diacritics
    .replace(/[^a-z0-9\s-]/g, "")        // remove special chars
    .replace(/\s+/g, "-")               // spaces to dashes
    .replace(/-+/g, "-")                // collapse multiple dashes
    .replace(/(^-|-$)/g, "");           // trim leading/trailing dashes
};

// generateSlug("Hello World!") => "hello-world"
export const generateUniqueSlug = async <T extends Record<string, any>>(
  text: string,
  model: PrismaModel<T>,
  field: keyof T = "slug" as keyof T
): Promise<string> => {
  const baseSlug = generateSlug(text);
  let slug = baseSlug;
  let count = 1;

  while (
    await model.findUnique({
      where: { [field]: slug } as Partial<T>,
      select: { [field]: true } as Partial<Record<keyof T, boolean>>,
    })
  ) {
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
};

// Example usage:
// const prisma = new PrismaClient();
// const slug = await generateUniqueSlug("Hello World!", prisma.product, "slug");
// console.log(slug); // "hello-world" or "hello-world-1" if exists