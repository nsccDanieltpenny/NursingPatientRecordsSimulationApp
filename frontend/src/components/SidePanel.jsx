import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { createAdministration } from '../utils/api';
const NOT_GIVEN_REASONS = [
  "Patient refused",
  "Held: vital signs outside order parameters",
  "NPO",
  "Medication unavailable",
  "Patient off unit",
  "Other",
];

// build the fields shown in the side panel
const buildPanel = (order, slot) => {
  const dose = slot.dose;
  const started = new Date(order.startAt);

  const fmtDateTime = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }) +
      " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const fmtDue = slot.dueAt ? fmtDateTime(slot.dueAt) : slot.dueTime;

  // "S. Oakes" from "Oakes, Shelby"
  const chartedBy = (() => {
    if (!dose?.chartedBy?.fullName) return null;
    const [last, first] = dose.chartedBy.fullName.split(", ");
    return `${first?.[0] ?? ""}. ${last ?? ""}`.trim();
  })();

  return {
    medication: order.drug.genericName,
    subtitle:
      `${order.dose}${order.doseMax ? "–" + order.doseMax : ""} ${order.doseUnit}, ${order.route}, ${order.form}, ${order.frequency}` +
      (order.dueTimes.length ? `, ${order.dueTimes.map((t) => "@" + t).join(", ")}` : "") +
      ` · started ${started.toLocaleDateString("en-US", { month: "short", day: "2-digit" })} ` +
      started.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
    status: dose?.status ?? "Due",
    due: fmtDue,
    time: dose?.givenAt ? fmtDateTime(dose.givenAt) : null,
    doseGiven: dose?.doseGiven != null ? `${dose.doseGiven} ${order.doseUnit}, ${order.route}` : null,
    chartedBy,
    comment: dose?.comment ?? null,
    notGivenReason: dose?.notGivenReason ?? null,
    prnReason: dose?.prnReason ?? null,
    response: dose?.response ?? null,
  };
};

const SidePanel = ({ openSlot, patientId, onClose, onCharted }) => {
  const [status, setStatus] = useState("Given");
  const [doseGiven, setDoseGiven] = useState("");
  const [notGivenReason, setNotGivenReason] = useState(NOT_GIVEN_REASONS[0]);
  const [givenAtLocal, setGivenAtLocal] = useState("");
  const [prnReason, setPrnReason] = useState("");
  const [comment, setComment] = useState("");
  const [rotationId, setRotationId] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [savedOk, setSavedOk] = useState(false);

  const { user } = useUser();
  const canChart = (user?.roles ?? []).some((r) => ["Admin", "Instructor", "Nurse"].includes(r));

  // reset form whenever a different slot opens
  useEffect(() => {
    if (!openSlot) return;
    const n = new Date();
    setStatus("Given");
    setDoseGiven(String(openSlot.order.dose ?? ""));
    setNotGivenReason(NOT_GIVEN_REASONS[0]);
    setGivenAtLocal(
      `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}T${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`
    );
    setPrnReason(openSlot.order.prnReasons?.[0] ?? "");
    setComment("");
    setRotationId("");
    setErrors([]);
    setWarnings([]);
    setSavedOk(false);
  }, [openSlot]);

  // body scroll + escape
  useEffect(() => {
    if (!openSlot) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openSlot, onClose]);

  if (!openSlot) return null;

  const { order, slot, prn } = openSlot;
  const isPRN = !!prn || order.orderType === "PRN";
  const isChartable = canChart && (isPRN || !slot.dose);
  const d = buildPanel(order, slot);

  const buildBody = (overrideWarnings = []) => {
    const givenAt = new Date(givenAtLocal).toISOString();
    const base = {
      status: isPRN ? "Given" : status,
      givenAt,
      comment: comment.trim() || null,
      rotationId: Number(rotationId),
      warningsOverridden: overrideWarnings,
    };
    if (isPRN) {
      return {
        ...base,
        status: "Given",
        doseGiven: Number(doseGiven),
        prnReason,
        notGivenReason: null,
      };
    }
    if (status === "Given") {
      return {
        ...base,
        dueAt: slot.dueAt,
        doseGiven: Number(doseGiven),
        notGivenReason: null,
      };
    }
    return {
      ...base,
      dueAt: slot.dueAt,
      doseGiven: null,
      notGivenReason,
    };
  };

  const validate = () => {
    const errs = [];
    if (!givenAtLocal) errs.push("Pick a given time.");
    if (!(Number(rotationId) > 0)) errs.push("Enter a rotation ID.");
    if (isPRN || status === "Given") {
      if (!(Number(doseGiven) > 0)) errs.push("Enter a dose above 0.");
    }
    if (isPRN && !prnReason) errs.push("Pick a PRN reason.");
    if (!isPRN && status === "NotGiven" && !notGivenReason) errs.push("Pick a not-given reason.");
    setErrors(errs);
    return errs.length === 0;
  };

  const submit = async (overrideWarnings = []) => {
    if (overrideWarnings.length === 0 && !validate()) return;
    setSaving(true);
    setErrors([]);
    try {
      await createAdministration(patientId, order.medicationOrderId, buildBody(overrideWarnings));
      setSavedOk(true);
      onCharted?.();
    } catch (err) {
      const res = err.response;
      if (res?.status === 409 && res.data?.warnings) {
        setWarnings(res.data.warnings);
      } else if (res?.status === 400 && res.data?.errors) {
        setErrors(res.data.errors);
      } else {
        setErrors(["Could not chart the dose. Try again."]);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="slot-panel-backdrop" onClick={onClose} />
      <aside className="slot-panel" role="dialog" aria-modal="true" aria-label="Dose details">
        <div className="slot-panel-header d-flex justify-content-between align-items-start p-3 border-bottom">
          <div className="fw-bold">{slot.dose ? "Charted dose" : isPRN ? "Chart PRN" : "Chart dose"}</div>
          <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
        </div>

        <div className="slot-panel-body p-3">
          <div className="fw-semibold">{d.medication}</div>
          <div className="text-muted small mb-3">{d.subtitle}</div>

          {slot.dose && (
            <dl className="row mb-3 small">
              <dt className="col-4 text-muted fw-normal">Status</dt>
              <dd className="col-8">{d.status}</dd>

              {d.due && (<>
                <dt className="col-4 text-muted fw-normal">Due</dt>
                <dd className="col-8">{d.due}</dd>
              </>)}

              {d.time && (<>
                <dt className="col-4 text-muted fw-normal">Time</dt>
                <dd className="col-8">{d.time}</dd>
              </>)}

              {d.doseGiven && (<>
                <dt className="col-4 text-muted fw-normal">Dose</dt>
                <dd className="col-8">{d.doseGiven}</dd>
              </>)}

              {d.chartedBy && (<>
                <dt className="col-4 text-muted fw-normal">Charted by</dt>
                <dd className="col-8">{d.chartedBy}</dd>
              </>)}

              {d.notGivenReason && (<>
                <dt className="col-4 text-muted fw-normal">Reason</dt>
                <dd className="col-8">{d.notGivenReason}</dd>
              </>)}

              {d.prnReason && (<>
                <dt className="col-4 text-muted fw-normal">Reason</dt>
                <dd className="col-8">{d.prnReason}</dd>
              </>)}

              {d.response && (<>
                <dt className="col-4 text-muted fw-normal">Response</dt>
                <dd className="col-8">
                  {d.response.effective}
                  {d.response.painScore != null && ` · pain ${d.response.painScore}/10`}
                  {d.response.comment && <div className="text-muted">{d.response.comment}</div>}
                </dd>
              </>)}

              {d.comment && (<>
                <dt className="col-4 text-muted fw-normal">Comment</dt>
                <dd className="col-8">{d.comment}</dd>
              </>)}
            </dl>
          )}

          {isChartable && !savedOk && (
            <div className="chart-form">
              {!isPRN && (
                <div className="mb-2">
                  <label className="form-label small mb-1">Status</label>
                  <select className="form-select form-select-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Given">Given</option>
                    <option value="NotGiven">Not Given</option>
                  </select>
                </div>
              )}

              {(isPRN || status === "Given") && (
                <div className="mb-2">
                  <label className="form-label small mb-1">Dose given ({order.doseUnit})</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className="form-control form-control-sm"
                    value={doseGiven}
                    onChange={(e) => setDoseGiven(e.target.value)}
                  />
                  {order.doseMax != null && (
                    <div className="form-text">Order range: {order.dose}–{order.doseMax} {order.doseUnit}</div>
                  )}
                </div>
              )}

              {!isPRN && status === "NotGiven" && (
                <div className="mb-2">
                  <label className="form-label small mb-1">Not given reason</label>
                  <select className="form-select form-select-sm" value={notGivenReason} onChange={(e) => setNotGivenReason(e.target.value)}>
                    {NOT_GIVEN_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              )}

              {isPRN && (
                <div className="mb-2">
                  <label className="form-label small mb-1">PRN reason</label>
                  <select className="form-select form-select-sm" value={prnReason} onChange={(e) => setPrnReason(e.target.value)}>
                    {(order.prnReasons ?? []).map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              )}

              <div className="mb-2">
                <label className="form-label small mb-1">Given at</label>
                <input
                  type="datetime-local"
                  className="form-control form-control-sm"
                  value={givenAtLocal}
                  onChange={(e) => setGivenAtLocal(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small mb-1">Comment</label>
                <textarea
                  className="form-control form-control-sm"
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. HR 72, BP 118/76."
                />
              </div>

              <div className="mb-3">
                <label className="form-label small mb-1">Rotation ID</label>
                <input
                  type="number"
                  min="1"
                  className="form-control form-control-sm"
                  value={rotationId}
                  onChange={(e) => setRotationId(e.target.value)}
                  placeholder="e.g. 3"
                />
              </div>

              {errors.length > 0 && (
                <div className="alert alert-danger py-2 small mb-2">
                  <ul className="mb-0 ps-3">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
                </div>
              )}

              {warnings.length > 0 && (
                <div className="alert alert-warning py-2 small mb-2">
                  <div className="fw-semibold mb-1">Warnings — chart anyway?</div>
                  <ul className="mb-2 ps-3">{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
                  <button
                    type="button"
                    className="btn btn-sm btn-warning"
                    disabled={saving}
                    onClick={() => submit(warnings)}
                  >
                    Chart anyway
                  </button>
                </div>
              )}

              <button
                type="button"
                className="btn btn-sm btn-primary w-100"
                disabled={saving || warnings.length > 0}
                onClick={() => submit([])}
              >
                {saving ? "Saving…" : "Chart dose"}
              </button>
            </div>
          )}

          {savedOk && (
            <div className="alert alert-success small py-2 mt-2">Dose charted.</div>
          )}

          {!isChartable && !slot.dose && (
            <div className="text-muted small mt-2">
              {canChart ? "This slot is not chartable." : "You do not have permission to chart this dose."}
            </div>
          )}
        </div>

        <div className="slot-panel-footer p-3 border-top text-end">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidePanel;