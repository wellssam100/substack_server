import SubscriptionForm from './SubscriptionForm';
function Sidebar({subscriptions, onSelect, sidebarVisible, setSidebarVisible, onRemove}){
    const handleCircleClick = () => {
        console.log("Top button clicked");
    };
    
    
    return(
        <div className={`sidebar-wrapper ${sidebarVisible ? 'visible' : 'hidden'}`}>
            <aside className="sidebar">
                <div className="sidebar-scroll">
                    <div className="sidebar-toggle-wrapper">
                        <button className="sidebar-toggle" onClick={() => setSidebarVisible(!sidebarVisible)}>
                            {sidebarVisible ? '←' : '→'}
                        </button>
                    </div>
                    
                    <div className="circle-button-wrapper">
                        <button
                        className="circle-button"
                        onClick={() => console.log("Circle button clicked")}
                        >
                            <img src='/icon.png' alt="Icon" className="circle-button-icon"/>
                        </button>
                    </div>
                    <h2>Subscriptions</h2>
                    {subscriptions.map((sub) => (
                        <div key={typeof sub === 'string' ? sub : sub.link}>
                            <button className="subscription-button" key={sub} onClick={() => onSelect(sub)}>
                                {sub.title}
                            </button>
                            <button className="subscription-remove-button" key={sub} onClick={() => onRemove(sub.link)}>
                                X
                            </button>
                        </div>
                    ))}
                    <SubscriptionForm />
                    <div className="sidebar-fade" />
                </div>
            </aside>
        </div>

    );
}

export default Sidebar;