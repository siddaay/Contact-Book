import React, {useState, useEffect} from "react"

const ContactList = ({ 
  contacts, 
  updateContact, 
  updateCallback, 
  handleSearchChange,
  currentSortBy = "first_name",
  currentSortOrder = "asc",
  currentSearchQuery = ""
}) => {
    const [sortBy, setSortBy] = useState(currentSortBy);
    const [sortOrder, setSortOrder] = useState(currentSortOrder);
    const [search, setSearch] = useState(currentSearchQuery);

    // Sync with parent component's state
    useEffect(() => {
        setSortBy(currentSortBy);
        setSortOrder(currentSortOrder);
        setSearch(currentSearchQuery);
    }, [currentSortBy, currentSortOrder, currentSearchQuery]);

    const handleSortChange = (event) => {
        const selectedValue = event.target.value;
        const [field, order] = selectedValue.split("-");

        setSortBy(field);
        setSortOrder(order);
        updateCallback(field, order, search);
    }

    const onSearchChange = (event) => {
        const searchValue = event.target.value;
        setSearch(searchValue);
        // Pass the search value to the parent component
        handleSearchChange(searchValue);
    }

    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_contact/${id}`, options)
            if (response.status === 200) {
                updateCallback(sortBy, sortOrder, search)
            } else {
                console.error("Failed to delete")
            }
        } catch (error) {
            alert(error)
        }
    }
    
    return <div>
        <h2>Contacts</h2>
        <input
            type="text"
            placeholder = "Search contacts..."
            value = {search}
            onChange = {onSearchChange}
        />
        <div className="sort-container">
            <p className="sort-label">Sort by:</p>
            <select className="sort-dropdown" onChange={handleSortChange} value={`${sortBy}-${sortOrder}`}>
                <option value="first_name-asc">First Name</option>
                <option value="first_name-desc">First Name (desc)</option>
                <option value="last_name-asc">Last Name</option>
                <option value="last_name-desc">Last Name (desc)</option>
                <option value="email-asc">Email</option>
                <option value="email-desc">Email (desc)</option>
            </select>
        </div>
        <table>
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {contacts.map((contact) => (
                    <tr key={contact.id}>
                        <td>{contact.firstName}</td>
                        <td>{contact.lastName}</td>
                        <td>{contact.email}</td>
                        <td>
                            <button onClick={() => updateContact(contact)}>Update</button>
                            <button onClick={() => onDelete(contact.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default ContactList