'use client';
import React from 'react';

const TabsMenu = ({ tabs, activeTab, setActiveTab }) => {

    return (
        <div className='detail-nav'>
            <ul className="flex nav nav-tabs">
                {tabs.map((tab) => (
                    <li key={tab.id} className="nav-item">
                        <button
                            onClick={() => setActiveTab(tab.id)}
                            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                            data-tab-id={tab.id}
                            >
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default TabsMenu;
