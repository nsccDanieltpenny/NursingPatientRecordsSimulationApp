import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import "../../css/mar_shift_schedule_styles.css";
import { getMar } from "../../utils/api";

// shift schedule page for one patient
const ShiftSchedule = () => {
  // patient id from the url
  const { id } = useParams();
  const [MARData, setMARData] = useState();
  const [selectedDate, setSelectedDate] = useState(() => new Date('2026-11-05'));
  const [ordersTimes, setOrdersTimes] = useState()
  const { user } = useUser();
  // get unique due times from orders
  useEffect(() => {
    const fetchPatientMAR = async () => {
      try {
        const results = await getMar(id, selectedDate.toISOString().split("T")[0]);
        setMARData(results);
        setOrdersTimes([...new Set(results.orders.flatMap((order) => order.dueTimes ?? []))].sort())
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    };
    fetchPatientMAR();
  }, [id, selectedDate]);

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
                {MARData && ordersTimes ? MARData.orders.map((order) => (
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
                    {ordersTimes.length != 0 ? ordersTimes.map((time) => {
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
                          <div className={className + ' text-nowrap text-center p-1'}>
                            {card.map((i, idx) => <div key={`${order.medicationOrderId}-${time}-${idx}`}>{i}</div>)}
                          </div>
                          : ''}
                      </td>
                    }) : ''}
                  </tr>
                )) : ''}
                {/* TODO: PRN and discontinue */}
              </tbody>
            </Table>
          </div>
        </section>
      </div>
    </div >
  )
}

export default ShiftSchedule

const style = {
  given: 'bg-success-subtle text-success border-success rounded border border-2',
  notGiven: 'bg-secondary-subtle border-secondary rounded border border-2',
  dueNow: '',
  overdue: 'bg-danger-subtle border-danger rounded border border-2',
  responseDue: 'bg-warning-subtle border-warning rounded border border-2',
}