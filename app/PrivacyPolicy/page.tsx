
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

export function PrivacyPolicy() {
  useEffect(() => {
    // SEO optimization
    document.title = 'Privacy Policy - MatrixProg | Secure AI Education Platform';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'MatrixProg privacy policy - Learn how we protect your data in our AI-powered education platform. COPPA compliant for K-12 students.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'MatrixProg privacy policy - Learn how we protect your data in our AI-powered education platform. COPPA compliant for K-12 students.';
      document.head.appendChild(meta);
    }

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Privacy Policy",
      "description": "MatrixProg privacy policy and data protection information",
      "url": "https://matrixprog.com/privacy-policy",
      "isPartOf": {
        "@type": "WebSite",
        "name": "MatrixProg",
        "url": "https://matrixprog.com"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</CardTitle>
            <p className="text-gray-600">Last updated: January 2, 2025</p>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                MatrixProg collects information to provide personalized AI-powered education services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Account Information:</strong> Email, name, and profile details when you register</li>
                <li><strong>Educational Data:</strong> Learning progress, quiz results, and skill assessments</li>
                <li><strong>Usage Data:</strong> Platform interactions, feature usage, and learning patterns</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and device information</li>
              </ul>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Personalize learning experiences with AI-generated content</li>
                <li>Track educational progress and provide analytics</li>
                <li>Improve our AI tutoring and assessment systems</li>
                <li>Send educational updates and platform notifications</li>
                <li>Ensure platform security and prevent abuse</li>
              </ul>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. COPPA Compliance (For Users Under 13)</h2>
              <p className="text-gray-700 mb-4">
                MatrixProg is COPPA compliant and takes special care with children's data:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Parental consent required for users under 13</li>
                <li>Limited data collection for educational purposes only</li>
                <li>No targeted advertising to children</li>
                <li>Parents can review and delete their child's data</li>
                <li>Enhanced security measures for children's accounts</li>
              </ul>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Third Parties</h2>
              <p className="text-gray-700 mb-4">We do not sell personal data. We may share information with:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>AI Service Providers:</strong> Groq API for content generation (anonymized)</li>
                <li><strong>Payment Processors:</strong> Paddle for subscription management</li>
                <li><strong>Educational Partners:</strong> Schools and institutions (with consent)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
              </ul>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement industry-standard security measures:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Encrypted data transmission and storage</li>
                <li>Regular security audits and monitoring</li>
                <li>Access controls and authentication</li>
                <li>Secure cloud infrastructure (MongoDB Atlas)</li>
              </ul>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Export your learning data</li>
                <li>Opt out of non-essential communications</li>
              </ul>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your data may be processed in countries outside your residence. We ensure adequate 
                protection through appropriate safeguards and compliance with applicable laws.
              </p>
            </section>

            <Separator className="my-6" />

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                For privacy questions or to exercise your rights, contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@matrixprog.com<br />
                  <strong>Address:</strong> MatrixProg Privacy Team<br />
                  <strong>Response Time:</strong> Within 30 days
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
