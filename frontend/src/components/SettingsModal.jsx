import React, { useState } from "react";
import Modal from "./Modal";
import SettingsSidebar from "./SettingsSidebar";
import GeneralSettings from "./GeneralSettings";
import AccountSettings from "./AccountSettings";

export default function SettingsModal({ open, onClose }) {
    const [tab, setTab] = useState("general");

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex">
                <SettingsSidebar tab={tab} setTab={setTab} />
                <div className="flex-1 p-6 min-w-[320px]">
                    {tab === "general" && <GeneralSettings />}
                    {tab === "account" && <AccountSettings />}
                </div>
            </div>
        </Modal>
    );
}
