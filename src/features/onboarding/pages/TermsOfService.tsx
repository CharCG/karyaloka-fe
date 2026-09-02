import BackButton from "../../../shared/components/IconButton";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background-base px-5 py-8">
      <div className="mb-8">
        <BackButton variant="primary" />
      </div>

      <div className="mb-8">
        <h1 className="text-h1 font-bold text-text-primary mb-2">Terms of Service</h1>
        <p className="text-body text-text-secondary">Last Updated: 1 September 2026</p>
      </div>

      <div className="flex flex-col gap-4 text-text-secondary">
        <section>
          <h2 className="text-h3 font-semibold text-text-primary mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Karyaloka platform (the "Service"), you agree to be bound by these Terms of
            Service. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary mb-2">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on
            Karyaloka's platform for personal, non-commercial transitory viewing only. This is the grant of a license,
            not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside">
            <li>Modifying or copying the materials</li>
            <li>Using the materials for any commercial purpose or for any public display</li>
            <li>Attempting to decompile or reverse engineer any software contained on the Service</li>
            <li>Removing any copyright or other proprietary notations from the materials</li>
            <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary mb-2">3. Disclaimer</h2>
          <p>
            The materials on Karyaloka's platform are provided on an 'as is' basis. Karyaloka makes no warranties,
            expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
            implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
            of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary mb-2">4. Limitations</h2>
          <p>
            In no event shall Karyaloka or its suppliers be liable for any damages (including, without limitation,
            damages for loss of data or profit, or due to business interruption) arising out of the use or inability to
            use the materials on Karyaloka's platform, even if Karyaloka or an authorized representative has been
            notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary mb-2">5. Accuracy of Materials</h2>
          <p>
            The materials appearing on Karyaloka's platform could include technical, typographical, or photographic
            errors. Karyaloka does not warrant that any of the materials on its platform are accurate, complete, or
            current. Karyaloka may make changes to the materials contained on its platform at any time without notice.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary mb-2">6. Links</h2>
          <p>
            Karyaloka has not reviewed all of the sites linked to its platform and is not responsible for the contents
            of any such linked site. The inclusion of any link does not imply endorsement by Karyaloka of the site. Use
            of any such linked website is at the user's own risk.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary mb-2">7. Modifications</h2>
          <p>
            Karyaloka may revise these terms of service for its platform at any time without notice. By using this
            platform, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary mb-2">8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of Indonesia, and you
            irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary mb-2">9. User Conduct</h2>
          <p>
            You agree not to engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service.
            Prohibited behavior includes:
          </p>
          <ul className="list-disc list-inside">
            <li>Harassing or causing distress or inconvenience to any person</li>
            <li>Offending the dignity of any person</li>
            <li>Disrupting the normal flow of dialogue</li>
            <li>Engaging in fraud or deception</li>
            <li>Violating any law or regulation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-h3 font-semibold text-text-primary mb-2">10. Contact Information</h2>
          <p>If you have any questions about these Terms of Service, please contact us at support@karyaloka.com.</p>
        </section>
      </div>
    </div>
  );
}
