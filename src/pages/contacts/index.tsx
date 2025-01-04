import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ContactsList from './list';

export default function Contacts() {
  return (
    <Routes>
      <Route index element={<ContactsList />} />
    </Routes>
  );
}