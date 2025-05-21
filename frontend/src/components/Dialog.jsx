import { useEffect } from "react";
import "../styles/DialogStyles.css";

export default function Dialog({onOk = () => {}, onClose = () => {}, content, style, className, isOpen, setIsOpen}) {
    const closeEvent = {
        preventedDefault: false,
        preventDefault: () => {closeEvent.preventedDefault = true}
    };

    useEffect(() => {
        closeEvent.preventedDefault = false;
    }, [isOpen]);

    function handleOk(e) {
        e.stopPropagation();
        onOk(closeEvent);
        if(!closeEvent.preventedDefault) {
            setIsOpen(false);
        }
    }

    function closeDialog(e) {
        e.stopPropagation();
        onClose(closeEvent);
        if (!closeEvent.preventedDefault) {
            setIsOpen(false);
        }
    }

    return (
        <div className="modal-background flex-container" style={{display: isOpen ? "flex" : "none"}}
        onClick={() => setIsOpen(false)}>
            <div className={`dialog-container flex-container-column ${className ? className : ""}`} style={style}>
                <div className="dialog-content">
                    {content}
                </div>
                <div className="flex-container dialog-footer">
                    <button className="generic-btn" onClick={handleOk}>Ok</button>
                    <button className="generic-btn" onClick={closeDialog}>Close</button>
                </div>
            </div>
        </div>
    )
}