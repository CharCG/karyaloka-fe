import { useNavigate } from "react-router";
import BackButton from "../components/BackButton";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-base px-5 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <BackButton variant="primary" />
        </div>

        <div className="mb-12">
          <h1 className="text-h1 font-bold text-text-primary mb-2">Privacy Policy</h1>
          <p className="text-body text-text-secondary">Last updated: September 2026</p>
        </div>

        <div className="prose prose-sm max-w-none text-text-secondary space-y-6">
          <section>
            <h2 className="text-h3 font-bold text-text-primary mb-3">1. Introduction</h2>
            <p>
              Karyaloka ("we" or "us" or "our") operates the Karyaloka platform. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-bold text-text-primary mb-3">2. Information Collection and Use</h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            
            <h3 className="text-body font-semibold text-text-primary mt-4 mb-2">Types of Data Collected:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Personal Data:</strong> Name, email address, phone number, postal address, cookies and usage data</li>
              <li><strong>Usage Data:</strong> Information about how the Service is accessed and used</li>
              <li><strong>Tracking & Cookies Data:</strong> We use cookies and similar technologies to track activity on our Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3 font-bold text-text-primary mb-3">3. Use of Data</h2>
            <p>
              Karyaloka uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical and security issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3 font-bold text-text-primary mb-3">4. Security of Data</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-bold text-text-primary mb-3">5. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-bold text-text-primary mb-3">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-3 p-4 bg-background-secondary rounded-lg">
              <p className="text-body-sm">Email: privacy@karyaloka.com</p>
              <p className="text-body-sm">Address: Jakarta, Indonesia</p>
            </div>
          </section>

          <section>
            <h2 className="text-h3 font-bold text-text-primary mb-3">7. Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Restrict processing of your data</li>
              <li>Object to processing of your data</li>
              <li>Request transfer of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3 font-bold text-text-primary mb-3">8. Data Retention</h2>
            <p>
              Karyaloka will retain your Personal Data only for as long as necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-bold text-text-primary mb-3">9. Third Party Services</h2>
            <p>
              Our Service may contain links to other sites that are not operated by us. This Privacy Policy does not apply to third-party websites, and we are not responsible for their privacy practices. We encourage you to review the privacy policy of any website before providing your personal information.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
