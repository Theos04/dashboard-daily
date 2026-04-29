  import { useEffect, useState } from "react";
  import { io } from "socket.io-client";
  import { fetchCRM } from "../api";

  // Capacitor imports
  import { Capacitor } from "@capacitor/core";
  import { Toast } from "@capacitor/toast";

  export default function CrmBook() {
    const [contacts, setContacts] = useState([]);
    const socket = io("http://localhost:3000"); // replace with your server

    // Load initial CRM data
    async function loadInitialData() {
      try {
        const data = await fetchCRM();
        setContacts(data.contacts || []);
      } catch (err) {
        console.error("Failed to load CRM:", err);
        if (Capacitor.isNativePlatform()) {
          Toast.show({ text: "Failed to load contacts!" });
        }
      }
    }

    // Refresh handler (if you want pull-to-refresh later)
    async function refreshData() {
      await loadInitialData();
      if (Capacitor.isNativePlatform()) {
        Toast.show({ text: "Contacts refreshed!" });
      }
    }

    // Socket update handler
    function handleSocketSync(data) {
      console.log("CRM SYNC RECEIVED:", data);
      setContacts(data.contacts || []);
      if (Capacitor.isNativePlatform()) {
        Toast.show({ text: "CRM synced!" });
      }
    }

    useEffect(() => {
      loadInitialData();
      socket.on("crm_synced", handleSocketSync);

      return () => {
        socket.off("crm_synced", handleSocketSync);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className="app-main">
        <h1>CRM Contacts</h1>
        {contacts.length > 0 ? (
          <div className="card">
            {contacts.map((contact) => (
              <div key={contact.id} className="activity-item">
                <div className="activity-details">
                  <p className="activity-action">{contact.name}</p>
                  <p className="activity-meta">{contact.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state-text">No contacts found. Syncing...</p>
          </div>
        )}
      </div>
    );
  }
