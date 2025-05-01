import React from 'react';
import { AlertTriangle } from 'lucide-react';

const SubscriptionExpiredModal = ({ subscription, onClose }) => {
  // Format the subscription end date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="bg-red-600 px-6 py-4 text-white">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-medium">Subscription Expired</h3>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="mb-4">
            <p className="text-gray-700 mb-4">
              Your shop dashboard subscription has expired or is inactive. Please renew your subscription to continue using all features.
            </p>
            
            {subscription && subscription.subscriptionEndDate && (
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-1">Subscription Details:</p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span> {subscription.isActive ? 'Active' : 'Inactive'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Approved:</span> {subscription.isApproved ? 'Yes' : 'No'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">End Date:</span> {formatDate(subscription.subscriptionEndDate)}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Renew Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionExpiredModal;