import SubscriptionForm from './SubscriptionForm';
function Sidebar({subscriptions, onSelect, sidebarVisible, setSidebarVisible, onRemove, sourceColors}){
    
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
                        onClick={() =>  onSelect("all")}
                        >
                            <img src='/icon.png' alt="Icon" className="circle-button-icon"/>
                        </button>
                    </div>
                    <h2>Subscriptions</h2>
                    {subscriptions.map((sub) => {
                    const key = typeof sub === 'string' ? sub : sub.link;
                    const title = typeof sub === 'string' ? sub : sub.title;
                    const link = typeof sub === 'string' ? sub : sub.link;
                    const source = title || 'unknown';
                    const bgColor = sourceColors[source] || '#333'; 
                    return (
                        <div className="subscription-row" key={key}>
                        <button className="subscription-remove-button" onClick={() => onRemove(link)}>
                            X
                        </button>
                        <button className="subscription-button" onClick={() => onSelect(sub)} style={{backgroundColor:bgColor}}>
                            <div>
                                <span className="subscription-title">{title}</span>                        
                            </div>
                        </button>
                        </div>
                    );
                    })}
                    <SubscriptionForm />
                    <div className="sidebar-fade" />
                </div>
            </aside>
        </div>

    );
}

export default Sidebar;