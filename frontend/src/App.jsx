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
    fetchContacts()
  }, [searchQuery]);

  const fetchContacts = async (sortBy = "first_name", sortOrder = "asc") => {
    const response = await fetch(`http://127.0.0.1:5000/contacts?sort_by=${sortBy}&sort_order=${sortOrder}&search=${searchQuery}`)
    const data = await response.json()
    setContacts(data.contacts)
    console.log(data.contacts)
  };

  const handleSearchChange = (search) => {
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

  const onUpdate = (sortBy, sortOrder) => {
    closeModal()
    fetchContacts(sortBy, sortOrder)
  }

  return (
    <>
      <ContactList
        contacts={contacts}
        updateContact={openEditModal}
        updateCallback={onUpdate}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        fetchContacts={fetchContacts}
        handleSearchChange={handleSearchChange}
      />
      <button onClick={openCreateModal}>Create New Contact</button>
      { isModalOpen && <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <ContactForm existingContact={currentContact} updateCallback={onUpdate}/>
        </div>
      </div>
      }
    </>
  );
}

export default App
