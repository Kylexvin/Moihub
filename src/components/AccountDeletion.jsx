import React from 'react';
import './accountdeletion.css';

const AccountDeletion = () => {
  return (
    <div className="deletion-page">
      <div className="deletion-container">
        <h1>Account & Data Deletion</h1>
        <p className="subtitle">
          We're sorry to see you go. Follow the instructions below to permanently delete your MoiHub account.
        </p>



        {/* Method 2: Email Support */}
        <div className="deletion-method secondary">
          <div className="method-header">
            <span className="method-icon">✉️</span>
            <h2>Email Support</h2>
          </div>
          <p className="method-description">
            You can request deletion via email:
          </p>
          
          <div className="email-instructions">
            <div className="instruction-item">
              <strong>Send email to:</strong>
              <a href="mailto:info.moihub@gmail.com" className="email-link">
                info.moihub@gmail.com
              </a>
            </div>
            
            <div className="instruction-item">
              <strong>Subject line:</strong>
              <code>Account Deletion Request</code>
            </div>
            
            <div className="instruction-item">
              <strong>Include in your email:</strong>
              <ul>
                <li>Your registered email address or phone number</li>
                <li>Your full name (as registered on MoiHub)</li>
                <li>Reason for deletion (optional but helpful)</li>
                <li>Confirmation that you understand this is permanent</li>
              </ul>
            </div>
          </div>

          <div className="alert-box info">
            <strong>⏱️ Processing Time:</strong> Email deletion requests are processed within 7 business days. You will receive a confirmation email once your account has been deleted.
          </div>
        </div>

        {/* What Gets Deleted */}
        <div className="info-section">
          <h2>What Gets Deleted</h2>
          <p>When you delete your account, the following information will be permanently removed:</p>
          <div className="data-grid">
            <div className="data-item">
              <span className="data-icon">👤</span>
              <strong>Profile Information</strong>
              <p>Name, email, phone number, profile picture</p>
            </div>
            <div className="data-item">
              <span className="data-icon">💬</span>
              <strong>Messages</strong>
              <p>All conversations and chat history</p>
            </div>
            <div className="data-item">
              <span className="data-icon">🏠</span>
              <strong>Listings</strong>
              <p>Hostel listings, marketplace items, shop products</p>
            </div>
            <div className="data-item">
              <span className="data-icon">📝</span>
              <strong>Activity</strong>
              <p>Comments, reviews, posts, and interactions</p>
            </div>
            <div className="data-item">
              <span className="data-icon">🔖</span>
              <strong>Saved Items</strong>
              <p>Bookmarks, favorites, and saved searches</p>
            </div>
            <div className="data-item">
              <span className="data-icon">⚙️</span>
              <strong>Preferences</strong>
              <p>Settings, notifications, and customizations</p>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div className="info-section">
          <h2>Data Retention Policy</h2>
          <p>
            After you delete your account, some data may be retained temporarily for legal, security, or operational purposes:
          </p>
          <ul className="retention-list">
            <li>
              <strong>Transaction Records:</strong> Financial transactions and order history may be retained for up to 90 days to comply with legal and accounting requirements.
            </li>
            <li>
              <strong>Security Logs:</strong> Basic security logs may be kept for up to 30 days to prevent fraud and abuse.
            </li>
            <li>
              <strong>Legal Obligations:</strong> Data required by law (such as tax records) will be retained for the legally required period.
            </li>
            <li>
              <strong>Cached Data:</strong> Information stored locally on your device can be removed by uninstalling the MoiHub app and clearing app data.
            </li>
          </ul>
          <p>
            After the retention period, all your data will be permanently and irreversibly deleted from our systems.
          </p>
        </div>

        {/* Before You Delete */}
        <div className="info-section warning-section">
          <h2>Before You Delete Your Account</h2>
          <p>Please consider the following before proceeding:</p>
          <div className="checklist">
            <div className="checklist-item">
              <span className="check-icon">✓</span>
              <div>
                <strong>Complete Active Transactions:</strong> Finish any ongoing orders, bookings, or sales before deleting your account.
              </div>
            </div>
            <div className="checklist-item">
              <span className="check-icon">✓</span>
              <div>
                <strong>Download Your Data:</strong> If you want to keep a copy of your information, contact support before deletion.
              </div>
            </div>
            <div className="checklist-item">
              <span className="check-icon">✓</span>
              <div>
                <strong>Cancel Subscriptions:</strong> If you're subscribed to Finance Department or premium services, cancel them first to avoid future charges.
              </div>
            </div>
            <div className="checklist-item">
              <span className="check-icon">✓</span>
              <div>
                <strong>Notify Contacts:</strong> Inform anyone you're communicating with on MoiHub that you're leaving the platform.
              </div>
            </div>
            <div className="checklist-item">
              <span className="check-icon">✓</span>
              <div>
                <strong>No Account Recovery:</strong> Once deleted, your account cannot be recovered or reactivated. You'll need to create a new account if you want to use MoiHub again.
              </div>
            </div>
          </div>
        </div>

        {/* Alternatives */}
        <div className="info-section alternatives">
          <h2>Alternatives to Account Deletion</h2>
          <p>If you're not sure about permanent deletion, consider these alternatives:</p>
          <div className="alternative-options">
            <div className="option">
              <h3>🔕 Disable Notifications</h3>
              <p>Turn off push notifications if they're bothering you, without deleting your account.</p>
            </div>
            <div className="option">
              <h3>🔒 Update Privacy Settings</h3>
              <p>Adjust who can see your profile and contact you in Settings → Privacy.</p>
            </div>
            <div className="option">
              <h3>🗑️ Delete Your LinkMe Profile</h3>
              <p>Remove your LinkMe profile while keeping your main account active for other services.</p>
            </div>
            <div className="option">
              <h3>⏸️ Take a Break</h3>
              <p>Simply log out and come back whenever you're ready. Your account will remain inactive.</p>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="help-section">
          <h2>Need Help?</h2>
          <p>
            If you have questions about account deletion or need assistance, our support team is here to help:
          </p>
          <div className="contact-info">
            <div className="contact-method">
              <span className="contact-icon">📧</span>
              <div>
                <strong>Email Support</strong>
                <a href="mailto:info.moihub@gmail.com">info.moihub@gmail.com</a>
              </div>
            </div>
          </div>
          <p className="response-time">
            We typically respond within 24-48 hours during business days.
          </p>
        </div>

        {/* Footer */}
        <div className="deletion-footer">
          <p>
            By deleting your account, you acknowledge that you have read and understood our 
            <a href="/learnmore"> Privacy Policy</a> and <a href="/learnmore">Terms of Service</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountDeletion;