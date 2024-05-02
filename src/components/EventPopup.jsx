// EventPopup.js window
const EventPopup = ({ event, onDelete, onClose }) => {
    return (
        <>
            <style>{`
                .event-popup {
                    position: absolute;
                    background-color: #fff;
                    border: 1px solid #ccc;
                    border-radius: 8px; /* Add border radius */
                    padding: 20px;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Add shadow */
                    z-index: 9999;
                    width: 300px; /* Set the width */
                    max-width: calc(100vw - 40px); /* Maximum width */
                    height: auto; /* Auto adjust height */
                    max-height: calc(100vh - 40px); /* Maximum height */
                    overflow: auto; /* Add scrollbars if needed */
                }
                
                .popup-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center; /* Center content */
                }
                
                .popup-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #ccc; /* Add line under the title */
                    padding-bottom: 10px; /* Add padding to separate the line */
                    width: 100%; /* Full width */
                    text-align: center; /* Center text */
                }
                
                .delete-warning {
                    background-color: rgba(255, 0, 0, 0.1); /* Red transparent background */
                    padding: 10px;
                    border-radius: 5px;
                    margin-top: 10px;
                    width: 100%; /* Full width */
                    text-align: center; /* Center text */
                }
                
                .delete-button {
                    background-color: #bd0d0d;
                    color: #fff;
                    border: none;
                    padding: 8px 16px;
                    cursor: pointer;
                    margin-top: 20px;
                    border-radius: 5px;
                }
                
                .delete-button:hover {
                    background-color: #cc0000;
                }

                .close-button {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    cursor: pointer;
                    background: none;
                    border: none;
                    font-size: 16px;
                    color: #888;
                }
                
                .close-button:hover {
                    color: #333;
                }
            `}</style>
            <div className="event-popup" style={{ position: 'absolute', top: event.y, left: event.x }}>
                <button className="close-button" onClick={onClose}>X</button>
                <div className="popup-content">
                    <h2 className="popup-title">Delete Confirmation!</h2>
                    <div className="delete-warning">
                        <p>Are you sure you want to delete <strong>{event.title}</strong>?</p>
                    </div>
                    <button className="delete-button" onClick={() => onDelete(event)}>Delete</button>
                </div>
            </div>
        </>
    );
};

export default EventPopup;
