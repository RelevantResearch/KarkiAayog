'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar } from 'lucide-react';

export default function TimelinePage() {
  const { language } = useLanguage();

  const timelineEvents = [
    {
      year: language === 'en' ? '2024 Q1' : '२०२४ Q1',
      title: language === 'en' ? 'Project Launch' : 'परियोजना सुरुवात',
      description:
        language === 'en'
          ? 'NepalDocs was launched with the vision of making Nepali documents searchable and accessible.'
          : 'नेपाल डक्स नेपाली कागजातहरूलाई खोज्न योग्य र पहुँचयोग्य बनाउने दृष्टिकोणको साथ सुरु गरिएको थियो।',
    },
    {
      year: language === 'en' ? '2024 Q2' : '२०२४ Q2',
      title:
        language === 'en'
          ? 'Translation Feature Added'
          : 'अनुवाद सुविधा थपियो',
      description:
        language === 'en'
          ? 'Introduced automatic English to Nepali translation for seamless searching.'
          : 'निर्बाध खोजको लागि स्वचालित अंग्रेजी देखि नेपाली अनुवाद प्रस्तुत गरियो।',
    },
    {
      year: language === 'en' ? '2024 Q3' : '२०२४ Q3',
      title: language === 'en' ? 'Document Viewer Enhanced' : 'कागजात दर्शक सुधारियो',
      description:
        language === 'en'
          ? 'Added support for rich content including images, tables, and formatted text with highlighting.'
          : 'हाइलाइटिङ्गको साथ तस्बिर, तालिका र ढाँचाबद्ध पाठ सहित समृद्ध सामग्रीको लागि समर्थन थपियो।',
    },
    {
      year: language === 'en' ? '2024 Q4' : '२०२४ Q4',
      title: language === 'en' ? 'Mobile Optimization' : 'मोबाइल अनुकूलन',
      description:
        language === 'en'
          ? 'Fully optimized the platform for mobile devices with responsive design and touch-friendly interface.'
          : 'उत्तरदायी डिजाइन र स्पर्श-मैत्री इन्टरफेसको साथ मोबाइल उपकरणहरूको लागि प्लेटफर्म पूर्ण रूपमा अनुकूलित गरियो।',
    },
    {
      year: language === 'en' ? '2025 Q1' : '२०२५ Q1',
      title:
        language === 'en' ? 'Dark Mode & Accessibility' : 'डार्क मोड र पहुँच',
      description:
        language === 'en'
          ? 'Implemented dark mode and enhanced accessibility features for better user experience.'
          : 'राम्रो प्रयोगकर्ता अनुभवको लागि डार्क मोड र परिष्कृत पहुँच सुविधाहरू लागू गरियो।',
    },
    {
      year: language === 'en' ? 'Coming Soon' : 'चाँडै आउँदै',
      title: language === 'en' ? 'AI-Powered Search' : 'AI-संचालित खोज',
      description:
        language === 'en'
          ? 'Planning to introduce AI-powered semantic search for more accurate and context-aware results.'
          : 'थप सटीक र सन्दर्भ-सचेत परिणामहरूको लागि AI-संचालित सिमेन्टिक खोज प्रस्तुत गर्ने योजना।',
    },
  ];

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
              {language === 'en' ? 'Project Timeline' : 'परियोजना समयरेखा'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === 'en'
                ? 'Our journey to make Nepali documents accessible'
                : 'नेपाली कागजातहरूलाई पहुँचयोग्य बनाउने हाम्रो यात्रा'}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-orange-600 hidden md:block"></div>

            <div className="space-y-8">
              {timelineEvents.map((event, index) => (
                <div
                  key={index}
                  className="relative pl-0 md:pl-20 animate-in fade-in slide-in-from-left duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="hidden md:flex absolute left-5 top-6 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-4 border-background shadow-lg items-center justify-center z-10"></div>

                  <div className="bg-card rounded-xl shadow-lg border border-border p-6 hover:shadow-xl transition-all duration-300 hover:border-orange-500">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 md:hidden">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-semibold">
                            {event.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Join Our Journey' : 'हाम्रो यात्रामा सामेल हुनुहोस्'}
            </h2>
            <p className="mb-6">
              {language === 'en'
                ? 'Be part of our mission to make Nepali information more accessible.'
                : 'नेपाली जानकारीलाई थप पहुँचयोग्य बनाउने हाम्रो मिशनको हिस्सा बन्नुहोस्।'}
            </p>
            <a
              href="/"
              className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
            >
              {language === 'en' ? 'Start Searching' : 'खोज सुरु गर्नुहोस्'}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
