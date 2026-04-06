// export const localeSections = ['header', 'footer', 'home', 'about', 'document', 'timeline', 'results'] as const;


// export type LocaleSection = (typeof localeSections)[number];

// /**
//  * Dynamically imports all JSON files for a given locale
//  */
// export async function loadLocaleMessages(locale: string) {
//   const messages: Record<string, any> = {};

//   for (const section of localeSections) {
//     try {
//       const module = await import(`/data/${locale}/${section}.json`);
//       messages[section] = module.default;
//     } catch (err) {
//       console.warn(`Failed to load /data/${locale}/${section}.json`, err);
//     }
//   }

//   return messages;
// }


// Remove 'document' from here  it's now loaded lazily via chunks
export const localeSections = ['header', 'footer', 'home', 'about', 'timeline', 'results'] as const;

export type LocaleSection = (typeof localeSections)[number];

export async function loadLocaleMessages(locale: string) {
  const messages: Record<string, any> = {};

  for (const section of localeSections) {
    try {
      const module = await import(`/data/${locale}/${section}.json`);
      messages[section] = module.default;
    } catch (err) {
      console.warn(`Failed to load /data/${locale}/${section}.json`, err);
    }
  }

  return messages;
}