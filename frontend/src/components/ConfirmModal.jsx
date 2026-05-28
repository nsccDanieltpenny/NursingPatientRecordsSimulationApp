import React from "react";
import { useEffect } from "react";

const ConfirmModal = ({
  open,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  styles = {},
  danger = false, // optional variant
}) => {
  if (!open) return null;


  
    useEffect(() => {
    if (open) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
    }, [open]);


  return (
    <>
    {/* Backdrop */}
    <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={onCancel}
      />
    <div 
        className={`modal fade show d-block`} tabIndex="-1"
        style={{ zIndex: 1055 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content"
          style={{
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
            border: "1px solid #0073e6",
            borderRadius: "12px",
            ...styles.modalDialog,
          }}
        >
          {/* Header */}
          <div
            className="modal-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              ...styles.modalHeader,
            }}
          >
            <h5 className="modal-title" style={{ color: "#004780" }}>
              {title}
            </h5>

            <button
              onClick={onCancel}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#00569c",
                color: "white",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div
            className="modal-body"
            style={{
              backgroundColor: "#f4f9ff",
              color: "#1a1a1a",
              ...styles.modalBody,
            }}
          >
            <p style={{ marginBottom: 0 }}>{message}</p>
          </div>

          {/* Footer */}
          <div
            className="modal-footer"
            style={{
              flexDirection: "column",
              borderTop: "none",
              backgroundColor: "#f4f9ff",
              ...styles.modalFooter,
            }}
          >
            <hr
              style={{
                width: "95%",
                border: "2px solid #0073e6",
                opacity: 0.25,
                borderRadius: "2px",
              }}
            />

            <div
              style={{
                width: "95%",
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={onCancel}
              >
                {cancelText}
              </button>

              <button
                className={`btn ${danger ? "btn-danger" : "btn-primary"}`}
                onClick={onConfirm}
                style={
                  !danger
                    ? {
                        backgroundColor: "#0073e6",
                        border: "none",
                      }
                    : {}
                }
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>


    </div>
    </>
  );
};

export default ConfirmModal;
``