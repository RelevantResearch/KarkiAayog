// 'use client';

// import React from 'react';
// import { useTranslations } from 'next-intl';
// import { BookOpen, Search, Globe, Zap } from 'lucide-react';
// import Link from 'next/link';

// const featureIcons = [Search, Globe, BookOpen, Zap] as const;

// type Feature = { title: string; description: string };

// export default function AboutPage() {
//   const t = useTranslations('about');

//   // next-intl returns a rich array  cast to our local type
//   const features = t.raw('features') as Feature[];

//   return (
//     <main className="min-h-screen py-12">
//       <div className="container mx-auto px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Title */}
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
//               {t('title')}
//             </h1>
//             <p className="text-base text-muted-foreground">{t('subtitle')}</p>
//           </div>

//           {/* Mission */}
//           <div className="bg-card rounded-xl shadow-lg border border-border p-8 mb-8">
//             <h2 className="text-2xl font-bold mb-4">{t('missionTitle')}</h2>
//             <p className="text-muted-foreground leading-relaxed mb-4">{t('missionP1')}</p>
//             <p className="text-muted-foreground leading-relaxed">{t('missionP2')}</p>
//           </div>

//           {/* Features grid */}
//           <div className="mb-8">
//             <h2 className="text-2xl font-bold mb-6 text-center">{t('featuresTitle')}</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {features.map((feature, index) => {
//                 const Icon = featureIcons[index % featureIcons.length];
//                 return (
//                   <div
//                     key={index}
//                     className="bg-card rounded-lg shadow border border-border p-6 hover:shadow-lg transition-all duration-300 hover:border-orange-500"
//                   >
//                     <div className="flex items-start space-x-4">
//                       <div className="flex-shrink-0">
//                         <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
//                           <Icon className="h-6 w-6 text-white" />
//                         </div>
//                       </div>
//                       <div>
//                         <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
//                         <p className="text-sm text-muted-foreground">{feature.description}</p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* CTA banner */}
//           <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-8 text-white text-center">
//             <h2 className="text-2xl font-bold mb-4">{t('ctaTitle')}</h2>
//             <p className="mb-6">{t('ctaBody')}</p>
//             <Link
//               href="/"
//               className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
//             >
//               {t('ctaButton')}
//             </Link>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');
  const languageItems = t.raw('languageItems') as string[];

  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto px-4 ">
          <nav className="max-w-4xl mx-auto mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground">About</span>
        </nav>
        
        <article className="max-w-4xl mx-auto bg-card rounded-xl shadow-lg border border-border p-8">
        

          {/* Title */}
          {/* <h1 className="text-3xl font-bold mb-6 text-primary">
            {t('title')}
          </h1> */}
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            {t('intro')}
          </p>

          <hr className="border-border mb-10" />

          {/* Vision */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-primary">
              {t('visionTitle')}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('visionBody')}
            </p>
          </section>

          <hr className="border-border mb-10" />

          {/* Why */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-primary">
              {t('whyTitle')}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              {t('whyP1')}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('whyP2')}
            </p>
          </section>

          <hr className="border-border mb-10" />

          {/* Background */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-primary">
              {t('backgroundTitle')}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              {t('backgroundP1')}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              {t('backgroundP2')}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('backgroundP3')}
            </p>
          </section>

          <hr className="border-border mb-10" />

          {/* Commission */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-primary">
              {t('commissionTitle')}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              {t('commissionP1')}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('commissionP2')}
            </p>
          </section>

          <hr className="border-border mb-10" />

          {/* Language Support */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-primary">
              {t('languageTitle')}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-3">
              {t('languageBody')}
            </p>
            <ul className="text-base space-y-1.5 pl-4 border-l-2 border-orange-500/40">
              {languageItems.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-border mb-10" />

          {/* Disclaimer */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-primary">
              {t('disclaimerTitle')}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('disclaimerBody')}
            </p>
          </section>

        </article>
      </div>
    </main>
  );
}