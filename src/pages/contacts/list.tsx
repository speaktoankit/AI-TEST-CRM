import React, { useState } from 'react';
import { useContacts } from '../../hooks/use-contacts';
import { useContactsStore } from '../../lib/store/contacts';
import { ContactFilters } from '../../components/contacts/contact-filters';
import { ContactsTable } from '../../components/contacts/contacts-table';
import { BulkActions } from '../../components/contacts/bulk-actions';
import { ContactDetail } from '../../components/contacts/contact-detail';
import { AdvancedFilters } from '../../components/contacts/advanced-filters';
import { TableCustomizer } from '../../components/contacts/table-customizer';
import { ImportModal } from '../../components/contacts/import-modal';
import { CreateContactModal } from '../../components/contacts/create-contact-modal';
import { UserPlus, Upload, Download, Filter } from 'lucide-react';
import type { Contact } from '../../lib/types';

export default function ContactsList() {
  const {
    contacts,
    isLoading,
    error,
    selectedContacts,
    view,
    search,
    leadStatus,
    setView,
    setSearch,
    setLeadStatus,
    selectContact,
    selectAll
  } = useContactsStore();

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showTableCustomizer, setShowTableCustomizer] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterConditions, setFilterConditions] = useState([]);

  const { refetch, deleteContact } = useContacts({
    search,
    filters: leadStatus !== 'All' ? { lead_status: leadStatus } : {},
  });

  const handleDeleteSelected = async () => {
    if (!window.confirm('Are you sure you want to delete the selected contacts?')) return;
    try {
      const promises = Array.from(selectedContacts).map(id =>
        deleteContact(id)
      );
      await Promise.all(promises);
      selectAll(false, []);
      await refetch();
    } catch (error) {
      console.error('Error deleting contacts:', error);
    }
  };

  if (error) {
    return (
      <div className="text-red-500">
        Error loading contacts: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Contacts ({contacts.length})
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button
            onClick={() => console.log('Exporting contacts')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Contact
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ContactFilters
          search={search}
          onSearchChange={setSearch}
          leadStatus={leadStatus}
          onLeadStatusChange={setLeadStatus}
          view={view}
          onViewChange={setView}
        />
        <div className="flex space-x-4">
          <button
            onClick={() => setShowTableCustomizer(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Customize Columns
          </button>
          <button
            onClick={() => setShowAdvancedFilters(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </button>
        </div>
      </div>

      <BulkActions
        selectedCount={selectedContacts.size}
        onDelete={handleDeleteSelected}
        onEmail={() => console.log('Email', selectedContacts)}
        onCall={() => console.log('Call', selectedContacts)}
        onExport={() => console.log('Export', selectedContacts)}
      />

      <ContactsTable
        contacts={contacts}
        isLoading={isLoading}
        onContactClick={setSelectedContact}
        selectedContacts={selectedContacts}
        onSelectContact={selectContact}
        onSelectAll={(selected) => selectAll(selected, contacts.map(c => c.id))}
      />

      {selectedContact && (
        <ContactDetail
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}

      {showAdvancedFilters && (
        <AdvancedFilters
          conditions={filterConditions}
          onAddCondition={() => {}}
          onRemoveCondition={() => {}}
          onUpdateCondition={() => {}}
          onApply={() => setShowAdvancedFilters(false)}
          onSaveView={() => setShowAdvancedFilters(false)}
        />
      )}

      {showTableCustomizer && (
        <TableCustomizer
          columns={[]}
          onColumnToggle={() => {}}
          onColumnReorder={() => {}}
        />
      )}

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={async () => {}}
        />
      )}

      {showCreateModal && (
        <CreateContactModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            refetch();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}