import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import "../../css/mar_shift_schedule_styles.css";
import axios, { getMar } from "../../utils/api";

// shift schedule page for one patient
const ShiftSchedule = () => {
  // patient id from the url
  const { id } = useParams();
  const [MARData, setMARData] = useState();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [ordersTimes, setOrdersTimes] = useState()
  const { user } = useUser();
  const [patient, setPatient] = useState(null);
  const [openSlot, setOpenSlot] = useState(null);
  // get unique due times from orders
  useEffect(() => {
    const fetchPatientMAR = async () => {
      try {
        const results = await getMar(id, selectedDate.toLocaleDateString("en-CA"));
        setMARData(results);
        setOrdersTimes([...new Set(results.orders.flatMap((order) => order.dueTimes ?? []))].sort())
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    };
    fetchPatientMAR();
  }, [id, selectedDate]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`/api/patients/${id}`);
        setPatient(response.data);
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    };
    fetchPatient();
  }, [id]);

  // Todo: check user is student or instructor
  // if (isInstructor) { new order, student review, discontinue order}
  const isInstructor = user;

  const handleSelectedDate = (move) => {
    setSelectedDate((dateBefore) => {
      const dateAfter = new Date(dateBefore);
      dateAfter.setDate(dateBefore.getDate() + move);
      return dateAfter;
    })
  }

  return (
    <div className='container mt-4'>
      <div className="mb-3">
        <h2 className="mb-0 fs-5 fw-semibold">New medication order{patient && " · " + patient.fullName}</h2>
      </div>
      <div className='d-md-flex justify-content-md-between'>
        <div className='me-md-3 mb-3 mb-md-0'>
          {/* left side: filter and notes */}
          {/* TODO: filters */}
          <div className='border rounded-3'>
            <div className="p-2 border-bottom">Note:</div>
            <div className="d-flex flex-wrap flex-md-column p-2">
              {[
                { cls: style.given, id: 'given', label: 'Given' },
                { cls: style.notGiven, id: 'not-given', label: 'Not Given' },
                { cls: style.dueNow, id: 'due-now', label: 'Due now (±60 min)' },
                { cls: style.overdue, id: 'overdue', label: 'Overdue' },
                { cls: style.responseDue, id: 'response-due', label: 'Response due' },
              ].map(({ cls, id, label }, idx) => (
                <span id={id} key={id} className={`d-flex align-items-center gap-1 text-nowrap ${idx !== 4 ? 'pe-2 pe-md-0' : ''}`}>
                  <i
                    className={cls.replace('rounded', '').replace('border-2', 'border-1')}
                    style={{ minWidth: '12px', minHeight: '12px', borderRadius: '3px', '--bs-border-width': '1.5px' }}
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <section aria-label="Time view" className='flex-grow-1'>
          {/* right side: time selected and table */}
          <div className='d-flex flex-wrap align-items-center mb-2'>
            <div className='fs-5 fw-bold'>
              Time view · {selectedDate.toLocaleDateString("en-US", {
                weekday: "short", month: "short", day: "2-digit",
              })}
            </div>
            <span className='ms-2'>
              {[
                { changeValue: -1, label: '<' },
                { changeValue: 1, label: '>' }
              ].map(({ changeValue, label }) =>
                <button
                  className='me-1 btn btn-outline-dark day-btn fw-bold'
                  onClick={() => handleSelectedDate(changeValue)}
                  key={"date-change-" + label + "-btn"}
                >
                  {label}
                </button>
              )}
            </span>
          </div>

          <div className="border rounded-3 overflow-hidden">
            <Table borderless responsive className='m-0'>
              <thead>
                <tr key='head'>
                  <th scope="col" className='col-5'>Medication</th>
                  {ordersTimes ? ordersTimes.map(time => <th key={time} scope="col" className='text-center col-2 border-start'>{time}</th>) : ''}
                </tr>
              </thead>
              <tbody>
                <tr key='Scheduled'>
                  <td colSpan="4" className='bg-primary-subtle text-primary-emphasis fw-bold border-top'>Scheduled</td>
                </tr>
                {MARData && ordersTimes ? MARData.orders.filter(order => order.orderType === "Scheduled").map((order) => (
                  <tr key={order.medicationOrderId} className='border-top'>
                    <td
                    >
                      <b>
                        {order.drug.genericName}
                      </b>
                      <div>
                        {order.dose} {order.doseUnit}, {order.route}, {order.form}, {order.frequency}, {order.dueTimes.map(dueTime => `@${dueTime}`).join(' & ')} · started {new Date(order.startAt).toLocaleDateString("en-US", {
                          month: "short", day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }).replace(",", "")}
                      </div>
                    </td>
                    {ordersTimes.length ? ordersTimes.map((time) => {
                      const slot = order.slots.find(slot => slot.dueTime === time)
                      let className = ''
                      let card = []
                      if (slot) {
                        if (slot?.dose) {
                          if (slot?.dose?.status === 'Given') {
                            const dosegiven = `${slot?.dose?.doseGiven} ${order.doseUnit}`
                            const status = `${slot?.dose?.status} ${slot?.dose?.chartedAt &&
                              new Date(slot.dose.chartedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}`
                            const [last, first] = slot?.dose?.chartedBy.fullName.split(', ') ?? [];
                            const chartedBy = `${first?.[0] ?? ''}. ${last ?? ''}`.trim();
                            className = style.given
                            card.push(dosegiven, status, chartedBy)
                          }
                          else if (slot?.dose?.status === 'NotGiven') {
                            className = style.notGiven
                            card.push('Not Given')
                          }
                        } else {
                          card.push('Due')
                        }
                      }
                      return <td key={order.medicationOrderId + time} className='border-start'>
                        {order.dueTimes.includes(time) ?
                          <button
                            type="button"
                            className={`slot-btn w-100 border-0 bg-transparent p-0 ${className}`}
                            onClick={() => setOpenSlot({ order, slot })}
                            aria-label={`Open details for ${order.drug.genericName} at ${time}`}
                          >
                            <div className={className + ' text-nowrap text-center p-1'}>
                              {slot && !slot.dose ? (
                                <>
                                  <div>Due</div>
                                  <div>@{time}</div>
                                  <div>{order.dose}{order.doseMax ? "–" + order.doseMax : ""} {order.doseUnit}</div>
                                </>
                              ) : (
                                card.map((i, idx) => <div key={`${order.medicationOrderId}-${time}-${idx}`}>{i}</div>)
                              )}
                            </div>
                          </button>
                          : ''}
                      </td>
                    }) : null}
                  </tr>
                )) : ''}
                {/* TODO: PRN and discontinue */}
              </tbody>
            </Table>
          </div>
        </section>
      </div>
      <SlotDetailPanel openSlot={openSlot} onClose={() => setOpenSlot(null)} />
    </div >
  )
}

// build the fields shown in the side panel for one slot
const buildSlotDetail = (order, slot) => {
  const dose = slot.dose;
  const started = new Date(order.startAt);

  const fmtDateTime = (iso) => {
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
  };
};

const SlotDetailPanel = ({ openSlot, onClose }) => {
  // lock body scroll and wire Escape while open
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
  const d = buildSlotDetail(openSlot.order, openSlot.slot);

  return (
    <>
      {/* dark backdrop; click closes */}
      <div className="slot-panel-backdrop" onClick={onClose} />
      <aside className="slot-panel" role="dialog" aria-modal="true" aria-label="Charted dose details">
        <div className="slot-panel-header d-flex justify-content-between align-items-start p-3 border-bottom">
          <div className="fw-bold">Charted dose</div>
          <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
        </div>

        <div className="slot-panel-body p-3">
          <div className="fw-semibold">{d.medication}</div>
          <div className="text-muted small mb-3">{d.subtitle}</div>

          <dl className="row mb-0 small">
            <dt className="col-4 text-muted fw-normal">Status</dt>
            <dd className="col-8">{d.status}</dd>

            <dt className="col-4 text-muted fw-normal">Due</dt>
            <dd className="col-8">{d.due}</dd>

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

            {d.comment && (<>
              <dt className="col-4 text-muted fw-normal">Comment</dt>
              <dd className="col-8">{d.comment}</dd>
            </>)}
          </dl>
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

export default ShiftSchedule

const style = {
  given: 'bg-success-subtle text-success border-success rounded border border-2',
  notGiven: 'bg-secondary-subtle border-secondary rounded border border-2',
  dueNow: '',
  overdue: 'bg-danger-subtle border-danger rounded border border-2',
  responseDue: 'bg-warning-subtle border-warning rounded border border-2',
}