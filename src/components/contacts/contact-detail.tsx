import React from 'react';
import { X, Mail, Phone, Building, Star } from 'lucide-react';
import type { Contact } from '../../lib/types';

interface ContactDetailProps {
  contact: Contact;
  onClose: () => void;
}

export function ContactDetail({ contact, onClose }: ContactDetailProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Contact Details</h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                        onClick={onClose}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative flex-1 px-4 py-6 sm:px-6">
                  {/* Contact Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-medium text-gray-900">
                        {contact.first_name} {contact.last_name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{contact.company}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{contact.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{contact.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{contact.company}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">Lead Score: {contact.lead_score}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                        Send Email
                      </button>
                      <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                        Call
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}