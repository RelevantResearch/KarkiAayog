'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, Search, Globe, Zap } from 'lucide-react';

export default function AboutPage() {
  const { language } = useLanguage();

  const features = [
    {
      icon: Search,
      title: language === 'en' ? 'Smart Search' : 'स्मार्ट खोज',
      description:
        language === 'en'
          ? 'Intelligent search that highlights matches and shows relevant results instantly.'
          : 'बुद्धिमान खोज जसले म्याच हाइलाइट गर्छ र तुरुन्तै सान्दर्भिक परिणामहरू देखाउँछ।',
    },
    {
      icon: Globe,
      title: language === 'en' ? 'Auto Translation' : 'स्वत: अनुवाद',
      description:
        language === 'en'
          ? 'Type in English and get automatic translation to Nepali as you type.'
          : 'अंग्रेजीमा टाइप गर्नुहोस् र तपाईंले टाइप गर्दा स्वचालित रूपमा नेपालीमा अनुवाद पाउनुहोस्।',
    },
    {
      icon: BookOpen,
      title: language === 'en' ? 'Rich Documents' : 'समृद्ध कागजात',
      description:
        language === 'en'
          ? 'Browse beautifully formatted documents with text, images, tables, and lists.'
          : 'पाठ, तस्बिर, तालिका र सूचीहरू सहित सुन्दर ढाँचामा राखिएका कागजातहरू ब्राउज गर्नुहोस्।',
    },
    {
      icon: Zap,
      title: language === 'en' ? 'Fast & Responsive' : 'छिटो र उत्तरदायी',
      description:
        language === 'en'
          ? 'Lightning-fast search with smooth animations and mobile-friendly design.'
          : 'सहज एनिमेसन र मोबाइल-मैत्री डिजाइनको साथ बिजुली-छिटो खोज।',
    },
  ];

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
              {language === 'en' ? 'About NepalDocs' : 'नेपाल डक्स बारेमा'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === 'en'
                ? 'Your gateway to exploring Nepali documents'
                : 'नेपाली कागजातहरू अन्वेषण गर्नको लागि तपाईंको प्रवेशद्वार'}
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-lg border border-border p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Our Mission' : 'हाम्रो मिशन'}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {language === 'en'
                ? 'NepalDocs is dedicated to making Nepali documents accessible and searchable for everyone. We believe that information should be easy to find and understand, regardless of language barriers.'
                : 'नेपाल डक्स सबैका लागि नेपाली कागजातहरूलाई पहुँचयोग्य र खोज्न योग्य बनाउन समर्पित छ। हामी विश्वास गर्छौं कि जानकारी सजिलैसँग फेला पार्न र बुझ्न सकिनुपर्छ, भाषा बाधाहरूको पर्वाह नगरी।'}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {language === 'en'
                ? 'With advanced search capabilities and automatic translation features, we aim to bridge the gap between languages and make information discovery seamless.'
                : 'उन्नत खोज क्षमताहरू र स्वचालित अनुवाद सुविधाहरूको साथ, हामी भाषाहरू बीचको खाडललाई पाट्ने र जानकारी खोज निर्बाध बनाउने लक्ष्य राख्छौं।'}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {language === 'en' ? 'Key Features' : 'मुख्य विशेषताहरू'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg shadow border border-border p-6 hover:shadow-lg transition-all duration-300 hover:border-orange-500"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Get Started Today' : 'आज सुरु गर्नुहोस्'}
            </h2>
            <p className="mb-6">
              {language === 'en'
                ? 'Start exploring Nepali documents with our powerful search tools.'
                : 'हाम्रो शक्तिशाली खोज उपकरणहरूसँग नेपाली कागजातहरू अन्वेषण गर्न सुरु गर्नुहोस्।'}
            </p>
            <a
              href="/"
              className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
            >
              {language === 'en' ? 'Go to Search' : 'खोजमा जानुहोस्'}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
