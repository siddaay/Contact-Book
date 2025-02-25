import { useState, useEffect } from 'react'
import ContactList from './ContactList'
import './App.css'
import ContactForm from './ContactForm'

function App() {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentContact, setCurrentContact] = useState({})
  const [sortBy, setSortBy] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchContacts(sortBy, sortOrder, searchQuery);
  }, [searchQuery, sortBy, sortOrder]);

  const fetchContacts = async (sortByParam = sortBy, sortOrderParam = sortOrder, searchParam = searchQuery) => {
    try {
      console.log(`Fetching contacts with: sort_by=${sortByParam}, sort_order=${sortOrderParam}, search=${searchParam}`);
      const response = await fetch(`http://127.0.0.1:5000/contacts?sort_by=${sortByParam}&sort_order=${sortOrderParam}&search=${searchParam}`)
      const data = await response.json()
      setContacts(data.contacts)
      console.log("Fetched contacts:", data.contacts)
    } catch (error) {
      console.error("Error fetching contacts:", error)
    }
  };

  const handleSearchChange = (search) => {
    console.log("Search changed to:", search);
    setSearchQuery(search);
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentContact({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (contact) => {
    if (isModalOpen) return
    setCurrentContact(contact)
    setIsModalOpen(true)
  }

  const onUpdate = (sortByParam, sortOrderParam, searchParam) => {
    closeModal()
    fetchContacts(sortByParam, sortOrderParam, searchParam)
  }

  return (
    <>
      <ContactList
        contacts={contacts}
        updateContact={openEditModal}
        updateCallback={onUpdate}
        handleSearchChange={handleSearchChange}
        currentSortBy={sortBy}
        currentSortOrder={sortOrder}
        currentSearchQuery={searchQuery}
      />
      <button onClick={openCreateModal}>Create New Contact</button>
      { isModalOpen && <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <ContactForm existingContact={currentContact} updateCallback={() => onUpdate(sortBy, sortOrder, searchQuery)}/>
        </div>
      </div>
      }
    </>
  );
}

export default App