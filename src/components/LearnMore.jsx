import React from 'react';
import { Link } from 'react-router-dom';
import './learnmore.css'

const LearnMore = () => {
  return (
    <>
    <div className="learn-more-container">
      <h2>Privacy & Legal Information</h2>

      {/* PRIVACY POLICY */}
      <div className="policy-section">
        <h3>Privacy Policy</h3>
        <p><strong>Effective Date:</strong> October 2024</p>
        
        <h4>1. Information We Collect</h4>
        <p>
          <strong>Account Information:</strong> When you register, we collect your email address and phone number to create and manage your account.
        </p>
        <p>
          <strong>Location Data:</strong> If you register as a service provider, we collect your general location to connect you with nearby users seeking services.
        </p>
        <p>
          <strong>Messages:</strong> In-app messages are stored temporarily to enable communication between users. These messages are automatically deleted after a period of inactivity.
        </p>
        <p>
          <strong>Cached Data:</strong> Certain app content may be stored locally on your device to improve loading times and app performance.
        </p>
        <p>
          <strong>Usage Information:</strong> We may collect information about how you use the app, including features accessed and interactions with other users, to improve our services.
        </p>

        <h4>2. How We Use Your Data</h4>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve MoiHub services and features</li>
          <li>Enable secure messaging and communication between users</li>
          <li>Send personalized push notifications about your orders, bookings, and relevant updates</li>
          <li>Maintain platform security, detect fraudulent activity, and prevent spam</li>
          <li>Respond to your support requests and inquiries</li>
          <li>Comply with legal obligations and enforce our Terms of Service</li>
        </ul>

        <h4>3. Sharing Your Data</h4>
        <p>
          We respect your privacy and do not sell or share your personal information with third parties for marketing purposes. We may share your information only in the following circumstances:
        </p>
        <ul>
          <li><strong>With other users:</strong> When you create listings, post comments, or message other users, certain information like your username may be visible</li>
          <li><strong>Legal requirements:</strong> When required by law, legal process, or government request</li>
          <li><strong>Safety and security:</strong> To protect the rights, property, or safety of MoiHub, our users, or the public</li>
        </ul>
        <p>
          External links in the app may direct you to trusted third-party websites. We are not responsible for the privacy practices of these external sites and do not track your activity outside MoiHub.
        </p>

        <h4>4. App Permissions</h4>
        <p>MoiHub requests the following permissions to provide full functionality:</p>
        <p>
          <strong>Camera:</strong> Used only when you choose to upload product images, profile photos, or other content. We never access your camera without your explicit action.
        </p>
        <p>
          <strong>Notifications:</strong> Used to send you alerts about orders, messages, bookings, and updates you've chosen to receive. You can disable notifications at any time.
        </p>
        <p>
          <strong>Location (optional):</strong> Used only by service providers to connect with nearby users. Regular users are not required to provide location access.
        </p>
        <p>
          All permissions are optional and clearly explained when requested. You can manage permissions in your device settings at any time.
        </p>

        <h4>5. Your Rights</h4>
        <p>You have control over your personal information:</p>
        <ul>
          <li><strong>Access:</strong> View and review your personal data stored in the app</li>
          <li><strong>Edit:</strong> Update your profile information, preferences, and settings at any time</li>
          <li><strong>Delete Profile:</strong> Remove your LinkMe profile directly in the app</li>
          <li><strong>Account Deletion:</strong> Request permanent deletion of your entire account and all associated data</li>
          <li><strong>Opt-Out:</strong> Disable push notifications or withdraw permissions in your device settings</li>
          <li><strong>Data Portability:</strong> Request a copy of your data by contacting support</li>
        </ul>

        <h4>6. Data Retention</h4>
        <p>
          <strong>Messages:</strong> Automatically deleted after inactivity to protect your privacy.
        </p>
        <p>
          <strong>Cached Data:</strong> Stored temporarily on your device and can be cleared by uninstalling the app or clearing app data.
        </p>
        <p>
          <strong>Account Information:</strong> Retained while your account is active and for up to 90 days after deletion for legal and security purposes.
        </p>
        <p>
          <strong>Transaction Records:</strong> May be retained longer where required by law for financial compliance.
        </p>

        <h4>7. Security</h4>
        <p>
          We take your security seriously and implement industry-standard measures to protect your information:
        </p>
        <ul>
          <li>All data transmitted between your device and our servers uses encrypted connections (HTTPS/TLS)</li>
          <li>Personal information is stored on secure servers with restricted access</li>
          <li>Only authorized personnel can access user data, and only when necessary for support or security purposes</li>
          <li>We regularly review and update our security practices</li>
        </ul>
        <p>
          However, no method of transmission over the internet is 100% secure. Please keep your login credentials confidential and notify us immediately if you suspect unauthorized access.
        </p>

        <h4>8. Children's Privacy</h4>
        <p>
          MoiHub is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we discover that a child has provided us with personal information, we will delete it immediately.
        </p>

        <h4>9. Changes to Privacy Policy</h4>
        <p>
          We may update this Privacy Policy from time to time. When we make changes, we will notify you through the app or by email. Your continued use of MoiHub after changes are posted constitutes acceptance of the updated policy.
        </p>

        <h4>10. Contact Us</h4>
        <p>
          If you have questions, concerns, or requests regarding your privacy or this Privacy Policy, please contact us at:
          <br/>
          <a href="mailto:info.moihub@gmail.com">info.moihub@gmail.com</a>
        </p>
      </div>

      {/* TERMS OF SERVICE */}
      <div className="policy-section">
        <h3>Terms of Service</h3>
        <p><strong>Effective Date:</strong> October 2024</p>

        <h4>1. Acceptance of Terms</h4>
        <p>
          By downloading, installing, registering for, or using the MoiHub mobile application, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use MoiHub.
        </p>

        <h4>2. Eligibility</h4>
        <p>
          You must be at least 18 years old to create an account and use MoiHub services. By using MoiHub, you represent and warrant that you meet this age requirement.
        </p>
        <p>
          While MoiHub is designed primarily for university and college students, registration is open to all eligible users who comply with these Terms.
        </p>

        <h4>3. Account Registration and Security</h4>
        <p>
          <strong>Account Creation:</strong> You must provide accurate, complete, and current information during registration. Providing false information is a violation of these Terms.
        </p>
        <p>
          <strong>One Account Per Person:</strong> Each user may maintain only one active account. Creating multiple accounts may result in suspension or termination.
        </p>
        <p>
          <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials. You must notify us immediately of any unauthorized access or security breach.
        </p>
        <p>
          <strong>Account Activity:</strong> You are responsible for all activities that occur under your account, whether or not authorized by you.
        </p>

        <h4>4. User Conduct and Content</h4>
        <p>
          All content you post, including listings, comments, reviews, messages, and profile information, must comply with our community guidelines. You agree not to:
        </p>
        <ul>
          <li>Post false, misleading, or fraudulent content</li>
          <li>Upload offensive, abusive, harassing, or discriminatory material</li>
          <li>Share illegal content or engage in illegal activities</li>
          <li>Post spam, advertisements, or unsolicited promotional content</li>
          <li>Impersonate others or misrepresent your identity or affiliation</li>
          <li>Violate any intellectual property rights</li>
          <li>Interfere with the proper functioning of the app</li>
          <li>Attempt to gain unauthorized access to other accounts or systems</li>
        </ul>
        <p>
          MoiHub administrators reserve the right to remove any content or suspend/terminate accounts that violate these rules without prior notice.
        </p>

        <h4>5. In-App Messaging</h4>
        <p>
          The messaging feature allows users to communicate within the app. Please note:
        </p>
        <ul>
          <li>All messages are tied to your verified account—anonymous messaging is not permitted</li>
          <li>Messages are stored temporarily and automatically deleted after inactivity</li>
          <li>Do not share sensitive financial information (credit card numbers, bank details) through messages</li>
          <li>Harassment, threats, or inappropriate messages may result in account suspension</li>
          <li>We may review messages if reported for violations or safety concerns</li>
        </ul>

        <h4>6. Push Notifications</h4>
        <p>
          MoiHub sends personalized push notifications to keep you informed about:
        </p>
        <ul>
          <li>Order updates and booking confirmations</li>
          <li>New messages from other users</li>
          <li>Relevant news and updates</li>
          <li>Service provider availability</li>
        </ul>
        <p>
          Push notifications are optional. You can disable them at any time in your device settings or app preferences.
        </p>

        <h4>7. External Links and Deep Links</h4>
        <p>
          MoiHub may contain links to external websites, resources, or services. We are not responsible for the content, privacy policies, or practices of third-party sites. Use external links at your own discretion.
        </p>
        <p>
          Deep links in push notifications and emails will direct you to specific content within the MoiHub app only.
        </p>

        <h4>8. Platform Services</h4>
        
        <p><strong>Hostels & Vacancies:</strong></p>
        <p>
          MoiHub facilitates connections between students seeking accommodation and landlords/property managers. We provide a platform to check availability and book hostels near universities. Please note:
        </p>
        <ul>
          <li>We do not own, manage, or verify the properties listed</li>
          <li>Availability information is provided by property owners and may change</li>
          <li>Users should verify all details directly with landlords before committing</li>
          <li>MoiHub is not responsible for disputes between tenants and landlords</li>
        </ul>

        <p><strong>Services (Transportation, Emergencies, etc.):</strong></p>
        <p>
          MoiHub connects users with service providers for transportation, emergency services, and other on-demand services. Important notes:
        </p>
        <ul>
          <li>We do not employ or endorse service providers—we only facilitate connections</li>
          <li>Service quality, pricing, and availability are determined by individual providers</li>
          <li>Review provider profiles, ratings, and reviews before booking</li>
          <li>MoiHub is not liable for service provider actions, delays, or quality issues</li>
          <li>Report problematic service providers through the app</li>
        </ul>

        <p><strong>E-Shop:</strong></p>
        <p>
          The E-Shop allows verified sellers to set up digital storefronts and sell products to the MoiHub community. Terms include:
        </p>
        <ul>
          <li>Sellers are responsible for accurate product descriptions, pricing, and images</li>
          <li>Sellers must fulfill orders promptly and provide customer service</li>
          <li>MoiHub facilitates transactions but is not a party to sales between buyers and sellers</li>
          <li>Refund and return policies are set by individual sellers</li>
          <li>MoiHub does not provide warranties for products sold through the E-Shop</li>
          <li>Report fraudulent sellers or counterfeit products immediately</li>
        </ul>

        <p><strong>Marketplace (Second-Hand Items):</strong></p>
        <p>
          The Marketplace enables peer-to-peer buying and selling of used items. Please understand:
        </p>
        <ul>
          <li>MoiHub does not verify the authenticity, quality, or condition of items</li>
          <li>Buyers and sellers negotiate prices and payment methods directly</li>
          <li>Meet in safe, public locations when exchanging items</li>
          <li>MoiHub does not mediate disputes or provide buyer/seller protection</li>
          <li>Users engage in marketplace transactions at their own risk</li>
        </ul>

        <p><strong>E-Chem (Pharmaceutical Services):</strong></p>
        <p>
          E-Chem provides access to pharmaceutical products. By using E-Chem, you agree:
        </p>
        <ul>
          <li>You must be 18+ to purchase pharmaceutical products</li>
          <li>Consult a qualified healthcare professional before using any pharmaceutical product</li>
          <li>Product information is provided for reference and may not be 100% complete</li>
          <li>Provide accurate health and prescription information when ordering</li>
          <li>All sales are final—goods once sold cannot be returned</li>
          <li>MoiHub is not liable for adverse reactions or misuse of products</li>
          <li>Prescription medications require valid prescriptions</li>
        </ul>

        <p><strong>Finance Department:</strong></p>
        <p>
          The Finance Department provides financial management tools and services for students, vendors, businesses, and service providers:
        </p>
        <ul>
          <li>Services include payment processing, payroll, budgeting, and approved reimbursements</li>
          <li>Available to students, vendors, shop owners, hotel operators, and registered businesses with valid credentials</li>
          <li>A monthly subscription fee applies and renews automatically per your agreement</li>
          <li>Access is suspended if subscription payments are missed</li>
          <li>All payments are final—no refunds are provided</li>
          <li>Users must comply with all applicable financial regulations and anti-fraud laws</li>
          <li>You are responsible for securing your financial account credentials</li>
          <li>MoiHub is not liable for financial losses due to user error, forgotten passwords, or unauthorized access due to weak security</li>
          <li>Suspicious activity may be reported to authorities</li>
        </ul>

        <p><strong>News & Blogs:</strong></p>
        <p>
          MoiHub provides news articles, blog posts, and educational content relevant to students. Note that:
        </p>
        <ul>
          <li>Opinions expressed are those of individual authors, not MoiHub</li>
          <li>We strive for accuracy but cannot guarantee completeness or timeliness</li>
          <li>Content is for informational purposes only</li>
        </ul>

        <p><strong>Roommate Finder:</strong></p>
        <p>
          This feature helps users find compatible roommates. Important disclaimers:
        </p>
        <ul>
          <li>MoiHub does not conduct background checks or verify user identities</li>
          <li>Exercise caution and conduct your own screening before committing</li>
          <li>Meet potential roommates in safe, public settings</li>
          <li>MoiHub is not responsible for roommate disputes or agreements</li>
        </ul>

        <h4>9. Payments and Subscriptions</h4>
        <p>
          Certain MoiHub services require payment, including:
        </p>
        <ul>
          <li>Finance Department monthly subscriptions</li>
          <li>Premium listings or featured placement</li>
          <li>Purchases through E-Shop and Marketplace</li>
        </ul>
        <p>
          Payment processing is handled through secure third-party providers. MoiHub does not store your payment information.
        </p>
        <p>
          <strong>All sales and subscriptions are final unless otherwise stated by the specific service.</strong> You are responsible for reviewing pricing before completing transactions.
        </p>

        <h4>10. Account and Data Deletion</h4>
        <p>
          You have the right to delete your MoiHub account at any time:
        </p>
        <ul>
          <li><strong>In-App Deletion:</strong> Go to Settings → Account → Delete Account</li>
          <li><strong>Via Support:</strong> Email info.moihub@gmail.com with "Account Deletion Request" in the subject line</li>
        </ul>
        <p>
          For detailed instructions, visit our <Link to="/delete-account" className="deletion-link">Account Deletion Guide</Link>.
        </p>
        <p>
          Upon deletion, your account information, profile, listings, and preferences will be permanently removed. Some data may be retained for up to 90 days for legal compliance.
        </p>

        <h4>11. Intellectual Property</h4>
        <p>
          The MoiHub app, including its design, features, content, and trademarks, is owned by MoiHub and protected by intellectual property laws. You may not:
        </p>
        <ul>
          <li>Copy, modify, or distribute the app or its content</li>
          <li>Reverse engineer or attempt to extract source code</li>
          <li>Use MoiHub branding without written permission</li>
        </ul>
        <p>
          Content you create (listings, posts, reviews) remains yours, but you grant MoiHub a license to use, display, and distribute it within the platform.
        </p>

        <h4>12. Termination and Suspension</h4>
        <p>
          MoiHub reserves the right to suspend or terminate your account if:
        </p>
        <ul>
          <li>You violate these Terms of Service or our policies</li>
          <li>You engage in fraudulent, illegal, or harmful activity</li>
          <li>You fail to pay required subscription fees</li>
          <li>We are required to do so by law</li>
        </ul>
        <p>
          Termination may occur with or without prior notice. Upon termination, your right to use MoiHub immediately ceases.
        </p>

        <h4>13. Limitation of Liability</h4>
        <p>
          To the maximum extent permitted by law:
        </p>
        <ul>
          <li>MoiHub is provided "as is" without warranties of any kind</li>
          <li>We do not guarantee uninterrupted, error-free, or secure service</li>
          <li>We are not liable for user-generated content or third-party actions</li>
          <li>We are not responsible for disputes between users (buyers/sellers, tenants/landlords, etc.)</li>
          <li>Our total liability for any claim is limited to the amount you paid to MoiHub in the past 12 months</li>
          <li>We are not liable for indirect, incidental, or consequential damages</li>
        </ul>

        <h4>14. Indemnification</h4>
        <p>
          You agree to indemnify and hold MoiHub harmless from any claims, damages, or expenses arising from:
        </p>
        <ul>
          <li>Your use of the app</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any third-party rights</li>
          <li>Content you post or actions you take on MoiHub</li>
        </ul>

        <h4>15. Changes to Terms</h4>
        <p>
          MoiHub reserves the right to update these Terms of Service at any time. We will notify users of significant changes through:
        </p>
        <ul>
          <li>In-app notifications</li>
          <li>Email to your registered address</li>
          <li>Updates to this page</li>
        </ul>
        <p>
          Your continued use of MoiHub after changes are posted constitutes acceptance of the updated Terms.
        </p>

        <h4>16. Governing Law</h4>
        <p>
          These Terms are governed by the laws of Kenya. Any disputes shall be resolved in the courts of Kenya.
        </p>

        <h4>17. Contact and Support</h4>
        <p>
          For questions, concerns, or support requests related to these Terms of Service:
        </p>
        <p>
          Email: <a href="mailto:info.moihub@gmail.com">info.moihub@gmail.com</a>
          <br/>
          We aim to respond to all inquiries within 48 hours.
        </p>
      </div>

      {/* ACCOUNT DELETION NOTICE */}
      <div className="policy-section highlight">
        <h3>Account & Data Deletion</h3>
        <p>
          Need to delete your MoiHub account? Visit our detailed 
          <Link to="/delete-account" className="deletion-link"> Account Deletion Guide</Link> for step-by-step instructions and alternative methods.
        </p>
        <p className="warning">
          ⚠️ Account deletion is permanent and cannot be undone. All your data, including listings, messages, and preferences, will be deleted.
        </p>
      </div>

      <div className="disclaimer">
        <p>
          <strong>Disclaimer:</strong> MoiHub is an independent platform and is not supported, endorsed, or affiliated with Moi University administration. This is a private entity operating independently.
        </p>
      </div>
    </div>
   </>
  );
}

export default LearnMore;